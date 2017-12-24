"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Implementation of server component.
 * Init and start server instance.
 */
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
const fs = require("fs");
const path = require("path");
const pathUtil = require("../util/pathUtil");
const Loader = require("pomelo-loader");
const utils = require("../util/utils");
const schedule = require("pomelo-scheduler");
const events_1 = require("../util/events");
const Constants = require("../util/constants");
const filterService_1 = require("../common/service/filterService");
const handlerService_1 = require("../common/service/handlerService");
const events_2 = require("events");
var ST_INITED = 0; // server inited
var ST_STARTED = 1; // server started
var ST_STOPED = 2; // server stoped
/**
 * Server factory function.
 *
 * @param {Object} app  current application context
 * @return {Object} erver instance
 */
function create(app, opts) {
    return new Server(app, opts);
}
exports.create = create;
;
class Server extends events_2.EventEmitter {
    constructor(app, opts) {
        super();
        this.globalFilterService = null;
        this.filterService = null;
        this.handlerService = null;
        this.cronHandlers = null;
        this.crons = [];
        this.jobs = {};
        this.state = ST_INITED;
        this.opts = opts || {};
        this.app = app;
        app.event.on(events_1.default.ADD_CRONS, this.addCrons.bind(this));
        app.event.on(events_1.default.REMOVE_CRONS, this.removeCrons.bind(this));
    }
    ;
    /**
     * Server lifecycle callback
     */
    start() {
        if (this.state > ST_INITED) {
            return;
        }
        this.globalFilterService = initFilter(true, this.app);
        this.filterService = initFilter(false, this.app);
        this.handlerService = initHandler(this.app, this.opts);
        this.cronHandlers = loadCronHandlers(this.app);
        loadCrons(this, this.app);
        this.state = ST_STARTED;
    }
    ;
    afterStart() {
        scheduleCrons(this, this.crons);
    }
    ;
    /**
     * Stop server
     */
    stop() {
        this.state = ST_STOPED;
    }
    ;
    /**
     * Global handler.
     *
     * @param  {Object} msg request message
     * @param  {Object} session session object
     * @param  {Callback} callback function
     */
    globalHandle(msg, session, cb) {
        if (this.state !== ST_STARTED) {
            utils.invokeCallback(cb, new Error('server not started'));
            return;
        }
        var routeRecord = parseRoute(msg.route);
        if (!routeRecord) {
            utils.invokeCallback(cb, new Error(`meet unknown route message ${msg.route}`));
            return;
        }
        var self = this;
        var dispatch = function (err, resp, opts) {
            if (err) {
                handleError(true, self, err, msg, session, resp, opts, function (err, resp, opts) {
                    response(true, self, err, msg, session, resp, opts, cb);
                });
                return;
            }
            if (self.app.getServerType() !== routeRecord.serverType) {
                doForward(self.app, msg, session, routeRecord, function (err, resp, opts) {
                    response(true, self, err, msg, session, resp, opts, cb);
                });
            }
            else {
                doHandle(self, msg, session, routeRecord, function (err, resp, opts) {
                    response(true, self, err, msg, session, resp, opts, cb);
                });
            }
        };
        beforeFilter(true, self, msg, session, dispatch);
    }
    ;
    /**
     * Handle request
     */
    handle(msg, session, cb) {
        if (this.state !== ST_STARTED) {
            cb(new Error('server not started'));
            return;
        }
        var routeRecord = parseRoute(msg.route);
        doHandle(this, msg, session, routeRecord, cb);
    }
    ;
    /**
     * Add crons at runtime.
     *
     * @param {Array} crons would be added in application
     */
    addCrons(crons) {
        this.cronHandlers = loadCronHandlers(this.app);
        for (var i = 0, l = crons.length; i < l; i++) {
            var cron = crons[i];
            checkAndAdd(cron, this.crons, this);
        }
        scheduleCrons(this, crons);
    }
    ;
    /**
     * Remove crons at runtime.
     *
     * @param {Array} crons would be removed in application
     */
    removeCrons(crons) {
        for (var i = 0, l = crons.length; i < l; i++) {
            var cron = crons[i];
            var id = parseInt(cron.id);
            if (!!this.jobs[id]) {
                schedule.cancelJob(this.jobs[id]);
            }
            else {
                logger.warn('cron is not in application: %j', cron);
            }
        }
    }
    ;
}
exports.Server = Server;
var initFilter = function (isGlobal, app) {
    var service = new filterService_1.FilterService();
    var befores, afters;
    if (isGlobal) {
        befores = app.get(Constants.KEYWORDS.GLOBAL_BEFORE_FILTER);
        afters = app.get(Constants.KEYWORDS.GLOBAL_AFTER_FILTER);
    }
    else {
        befores = app.get(Constants.KEYWORDS.BEFORE_FILTER);
        afters = app.get(Constants.KEYWORDS.AFTER_FILTER);
    }
    var i, l;
    if (befores) {
        for (i = 0, l = befores.length; i < l; i++) {
            service.before(befores[i]);
        }
    }
    if (afters) {
        for (i = 0, l = afters.length; i < l; i++) {
            service.after(afters[i]);
        }
    }
    return service;
};
var initHandler = function (app, opts) {
    return new handlerService_1.HandlerService(app, opts);
};
/**
 * Load cron handlers from current application
 */
var loadCronHandlers = function (app) {
    var p = pathUtil.getCronPath(app.getBase(), app.getServerType());
    if (p) {
        return Loader.load(p, app);
    }
};
/**
 * Load crons from configure file
 */
var loadCrons = function (server, app) {
    var env = app.get(Constants.RESERVED.ENV);
    var p = path.join(app.getBase(), Constants.FILEPATH.CRON);
    if (!fs.existsSync(p)) {
        p = path.join(app.getBase(), Constants.FILEPATH.CONFIG_DIR, env, path.basename(Constants.FILEPATH.CRON));
        if (!fs.existsSync(p)) {
            return;
        }
    }
    app.loadConfigBaseApp(Constants.RESERVED.CRONS, Constants.FILEPATH.CRON);
    var crons = app.get(Constants.RESERVED.CRONS);
    for (var serverType in crons) {
        if (app.serverType === serverType) {
            var list = crons[serverType];
            for (var i = 0; i < list.length; i++) {
                if (!list[i].serverId) {
                    checkAndAdd(list[i], server.crons, server);
                }
                else {
                    if (app.serverId === list[i].serverId) {
                        checkAndAdd(list[i], server.crons, server);
                    }
                }
            }
        }
    }
};
/**
 * Fire before filter chain if any
 */
var beforeFilter = function (isGlobal, server, msg, session, cb) {
    var fm;
    if (isGlobal) {
        fm = server.globalFilterService;
    }
    else {
        fm = server.filterService;
    }
    if (fm) {
        fm.beforeFilter(msg, session, cb);
    }
    else {
        utils.invokeCallback(cb);
    }
};
/**
 * Fire after filter chain if have
 */
var afterFilter = function (isGlobal, server, err, msg, session, resp, opts, cb) {
    var fm;
    if (isGlobal) {
        fm = server.globalFilterService;
    }
    else {
        fm = server.filterService;
    }
    if (fm) {
        if (isGlobal) {
            fm.afterFilter(err, msg, session, resp, function () {
                // do nothing
            });
        }
        else {
            fm.afterFilter(err, msg, session, resp, function (err) {
                cb(err, resp, opts);
            });
        }
    }
};
/**
 * pass err to the global error handler if specified
 */
var handleError = function (isGlobal, server, err, msg, session, resp, opts, cb) {
    var handler;
    if (isGlobal) {
        handler = server.app.get(Constants.RESERVED.GLOBAL_ERROR_HANDLER);
    }
    else {
        handler = server.app.get(Constants.RESERVED.ERROR_HANDLER);
    }
    if (!handler) {
        logger.error(`${server.app.serverId} no default error handler msg[${JSON.stringify(msg)}] to resolve unknown exception: sessionId:${JSON.stringify(session.export())} , error stack: ${err.stack}`);
        utils.invokeCallback(cb, err, resp, opts);
    }
    else {
        if (handler.length === 5) {
            handler(err, msg, resp, session, cb);
        }
        else {
            handler(err, msg, resp, session, opts, cb);
        }
    }
};
/**
 * Send response to client and fire after filter chain if any.
 */
var response = function (isGlobal, server, err, msg, session, resp, opts, cb) {
    if (isGlobal) {
        cb(err, resp, opts);
        // after filter should not interfere response
        afterFilter(isGlobal, server, err, msg, session, resp, opts, cb);
    }
    else {
        afterFilter(isGlobal, server, err, msg, session, resp, opts, cb);
    }
};
/**
 * Parse route string.
 *
 * @param  {String} route route string, such as: serverName.handlerName.methodName
 * @return {Object}       parse result object or null for illeagle route string
 */
var parseRoute = function (route) {
    if (!route) {
        return null;
    }
    var ts = route.split('.');
    if (ts.length !== 3) {
        return null;
    }
    return {
        route: route,
        serverType: ts[0],
        handler: ts[1],
        method: ts[2]
    };
};
var doForward = function (app, msg, session, routeRecord, cb) {
    var finished = false;
    //should route to other servers
    try {
        app.sysrpc[routeRecord.serverType].msgRemote.forwardMessage(
        // app.sysrpc[routeRecord.serverType].msgRemote.forwardMessage2(
        session, msg, 
        // msg.oldRoute || msg.route,
        // msg.body,
        // msg.aesPassword,
        // msg.compressGzip,
        session.export()).then(function (resp, opts) {
            finished = true;
            utils.invokeCallback(cb, null, resp, opts);
        }).catch(function (err) {
            logger.error(app.serverId + ' fail to process remote message:' + err.stack);
            utils.invokeCallback(cb, err);
        });
    }
    catch (err) {
        if (!finished) {
            logger.error(app.serverId + ' fail to forward message:' + err.stack);
            utils.invokeCallback(cb, err);
        }
    }
};
var doHandle = function (server, msg, session, routeRecord, cb) {
    var originMsg = msg;
    msg = msg.body || {};
    msg.__route__ = originMsg.route;
    var self = server;
    var handle = function (err, resp, opts) {
        if (err) {
            // error from before filter
            handleError(false, self, err, msg, session, resp, opts, function (err, resp, opts) {
                response(false, self, err, msg, session, resp, opts, cb);
            });
            return;
        }
        self.handlerService.handle(routeRecord, msg, session, function (err, resp, opts) {
            if (err) {
                //error from handler
                handleError(false, self, err, msg, session, resp, opts, function (err, resp, opts) {
                    response(false, self, err, msg, session, resp, opts, cb);
                });
                return;
            }
            response(false, self, err, msg, session, resp, opts, cb);
        });
    }; //end of handle
    beforeFilter(false, server, msg, session, handle);
};
/**
 * Schedule crons
 */
var scheduleCrons = function (server, crons) {
    var handlers = server.cronHandlers;
    for (var i = 0; i < crons.length; i++) {
        var cronInfo = crons[i];
        var time = cronInfo.time;
        var action = cronInfo.action;
        var jobId = cronInfo.id;
        if (!time || !action || !jobId) {
            logger.error(server.app.serverId + ' cron miss necessary parameters: %j', cronInfo);
            continue;
        }
        if (action.indexOf('.') < 0) {
            logger.error(server.app.serverId + ' cron action is error format: %j', cronInfo);
            continue;
        }
        var cron = action.split('.')[0];
        var job = action.split('.')[1];
        var handler = handlers[cron];
        if (!handler) {
            logger.error('could not find cron: %j', cronInfo);
            continue;
        }
        if (typeof handler[job] !== 'function') {
            logger.error('could not find cron job: %j, %s', cronInfo, job);
            continue;
        }
        var id = schedule.scheduleJob(time, handler[job].bind(handler));
        server.jobs[jobId] = id;
    }
};
/**
 * If cron is not in crons then put it in the array.
 */
var checkAndAdd = function (cron, crons, server) {
    if (!containCron(cron.id, crons)) {
        server.crons.push(cron);
    }
    else {
        logger.warn('cron is duplicated: %j', cron);
    }
};
/**
 * Check if cron is in crons.
 */
var containCron = function (id, crons) {
    for (var i = 0, l = crons.length; i < l; i++) {
        if (id === crons[i].id) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=server.js.map