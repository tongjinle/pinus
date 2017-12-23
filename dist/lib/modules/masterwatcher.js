"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
const utils = require("../util/utils");
const Constants = require("../util/constants");
const watchdog_1 = require("../master/watchdog");
class MasterWatcherModule {
    constructor(opts, consoleService) {
        this.app = opts.app;
        this.service = consoleService;
        this.id = this.app.getServerId();
        this.watchdog = new watchdog_1.Watchdog(this.app, this.service);
        this.service.on('register', this.onServerAdd.bind(this));
        this.service.on('disconnect', this.onServerLeave.bind(this));
        this.service.on('reconnect', this.onServerReconnect.bind(this));
    }
    ;
    // ----------------- bind methods -------------------------
    onServerAdd(record) {
        logger.debug('masterwatcher receive add server event, with server: %j', record);
        if (!record || record.type === 'client' || !record.serverType) {
            return;
        }
        this.watchdog.addServer(record);
    }
    ;
    onServerReconnect(record) {
        logger.debug('masterwatcher receive reconnect server event, with server: %j', record);
        if (!record || record.type === 'client' || !record.serverType) {
            logger.warn('onServerReconnect receive wrong message: %j', record);
            return;
        }
        this.watchdog.reconnectServer(record);
    }
    ;
    onServerLeave(id, type) {
        logger.debug('masterwatcher receive remove server event, with server: %s, type: %s', id, type);
        if (!id) {
            logger.warn('onServerLeave receive server id is empty.');
            return;
        }
        if (type !== 'client') {
            this.watchdog.removeServer(id);
        }
    }
    ;
    // ----------------- module methods -------------------------
    start(cb) {
        utils.invokeCallback(cb);
    }
    ;
    masterHandler(agent, msg, cb) {
        if (!msg) {
            logger.warn('masterwatcher receive empty message.');
            return;
        }
        var func = masterMethods[msg.action];
        if (!func) {
            logger.info('masterwatcher unknown action: %j', msg.action);
            return;
        }
        func(this, agent, msg, cb);
    }
    ;
}
MasterWatcherModule.moduleId = Constants.KEYWORDS.MASTER_WATCHER;
exports.MasterWatcherModule = MasterWatcherModule;
// ----------------- monitor request methods -------------------------
var subscribe = function (module, agent, msg, cb) {
    if (!msg) {
        utils.invokeCallback(cb, new Error('masterwatcher subscribe empty message.'));
        return;
    }
    module.watchdog.subscribe(msg.id);
    utils.invokeCallback(cb, null, module.watchdog.query());
};
var unsubscribe = function (module, agent, msg, cb) {
    if (!msg) {
        utils.invokeCallback(cb, new Error('masterwatcher unsubscribe empty message.'));
        return;
    }
    module.watchdog.unsubscribe(msg.id);
    utils.invokeCallback(cb);
};
var query = function (module, agent, msg, cb) {
    utils.invokeCallback(cb, null, module.watchdog.query());
};
var record = function (module, agent, msg, cb) {
    if (!msg) {
        utils.invokeCallback(cb, new Error('masterwatcher record empty message.'));
        return;
    }
    module.watchdog.record(msg.id);
};
var masterMethods = {
    'subscribe': subscribe,
    'unsubscribe': unsubscribe,
    'query': query,
    'record': record
};
//# sourceMappingURL=masterwatcher.js.map