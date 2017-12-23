"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
const utils = require("../util/utils");
const Constants = require("../util/constants");
const countDownLatch = require("../util/countDownLatch");
const events_1 = require("events");
class Watchdog extends events_1.EventEmitter {
    constructor(app, service) {
        super();
        this.app = app;
        this.service = service;
        this.isStarted = false;
        this.servers = {};
        this._listeners = {};
        this.addServer = function (server) {
            if (!server) {
                return;
            }
            this.servers[server.id] = server;
            this.notify({ action: 'addServer', server: server });
        };
        this.removeServer = function (id) {
            if (!id) {
                return;
            }
            this.unsubscribe(id);
            delete this.servers[id];
            this.notify({ action: 'removeServer', id: id });
        };
        this.reconnectServer = function (server) {
            var self = this;
            if (!server) {
                return;
            }
            if (!this.servers[server.id]) {
                this.servers[server.id] = server;
            }
            //replace server in reconnect server
            this.notifyById(server.id, { action: 'replaceServer', servers: self.servers });
            // notify other server to add server
            this.notify({ action: 'addServer', server: server });
            // add server in listener
            this.subscribe(server.id);
        };
        this.subscribe = function (id) {
            this._listeners[id] = 1;
        };
        this.unsubscribe = function (id) {
            delete this._listeners[id];
        };
        this.query = function () {
            return this.servers;
        };
        this.record = function (id) {
            if (!this.isStarted && --this.count < 0) {
                var usedTime = Date.now() - this.app.startTime;
                logger.info('all servers startup in %s ms', usedTime);
                this.notify({ action: 'startOver' });
                this.isStarted = true;
            }
        };
        this.notifyById = function (id, msg) {
            this.service.agent.request(id, Constants.KEYWORDS.MONITOR_WATCHER, msg, function (signal) {
                if (signal !== Constants.SIGNAL.OK) {
                    logger.error('master watchdog fail to notify to monitor, id: %s, msg: %j', id, msg);
                }
                else {
                    logger.debug('master watchdog notify to monitor success, id: %s, msg: %j', id, msg);
                }
            });
        };
        this.notify = function (msg) {
            var _listeners = this._listeners;
            var success = true;
            var fails = [];
            var timeouts = [];
            var requests = {};
            var count = utils.size(_listeners);
            if (count === 0) {
                logger.warn('master watchdog _listeners is none, msg: %j', msg);
                return;
            }
            var latch = countDownLatch.createCountDownLatch(count, { timeout: Constants.TIME.TIME_WAIT_COUNTDOWN }, function (isTimeout) {
                if (!!isTimeout) {
                    for (var key in requests) {
                        if (!requests[key]) {
                            timeouts.push(key);
                        }
                    }
                    logger.error('master watchdog request timeout message: %j, timeouts: %j, fails: %j', msg, timeouts, fails);
                }
                if (!success) {
                    logger.error('master watchdog request fail message: %j, fails: %j', msg, fails);
                }
            });
            var moduleRequest = function (self, id) {
                return (function () {
                    self.service.agent.request(id, Constants.KEYWORDS.MONITOR_WATCHER, msg, function (signal) {
                        if (signal !== Constants.SIGNAL.OK) {
                            fails.push(id);
                            success = false;
                        }
                        requests[id] = 1;
                        latch.done();
                    });
                })();
            };
            for (var id in _listeners) {
                requests[id] = 0;
                moduleRequest(this, id);
            }
        };
        this.count = utils.size(app.getServersFromConfig());
    }
    ;
}
exports.Watchdog = Watchdog;
//# sourceMappingURL=watchdog.js.map