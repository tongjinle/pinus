"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const starter = require("./starter");
const pinus_logger_1 = require("pinus-logger");
var logger = pinus_logger_1.getLogger('pinus', __filename);
var crashLogger = pinus_logger_1.getLogger('crash-log', __filename);
var adminLogger = pinus_logger_1.getLogger('admin-log', __filename);
const admin = require("pinus-admin");
const util = require("util");
const utils = require("../util/utils");
const moduleUtil = require("../util/moduleUtil");
const Constants = require("../util/constants");
class MasterServer {
    constructor(app, opts) {
        this.registered = {};
        this.modules = [];
        this.app = app;
        this.masterInfo = app.getMaster();
        opts = opts || {};
        opts.port = this.masterInfo.port;
        opts.env = this.app.get(Constants.RESERVED.ENV);
        this.closeWatcher = opts.closeWatcher;
        this.masterConsole = admin.createMasterConsole(opts);
    }
    ;
    start(cb) {
        moduleUtil.registerDefaultModules(true, this.app, this.closeWatcher);
        moduleUtil.loadModules(this, this.masterConsole);
        var self = this;
        // start master console
        this.masterConsole.start(function (err) {
            if (err) {
                process.exit(0);
            }
            moduleUtil.startModules(self.modules, function (err) {
                if (err) {
                    utils.invokeCallback(cb, err);
                    return;
                }
                if (self.app.get(Constants.RESERVED.MODE) !== Constants.RESERVED.STAND_ALONE) {
                    starter.runServers(self.app);
                }
                utils.invokeCallback(cb);
            });
        });
        this.masterConsole.on('error', function (err) {
            if (!!err) {
                logger.error('masterConsole encounters with error: ' + err.stack);
                return;
            }
        });
        this.masterConsole.on('reconnect', function (info) {
            self.app.addServers([info]);
        });
        // monitor servers disconnect event
        this.masterConsole.on('disconnect', function (id, type, info, reason) {
            crashLogger.info(util.format('[%s],[%s],[%s],[%s]', type, id, Date.now(), reason || 'disconnect'));
            var count = 0;
            var time = 0;
            var pingTimer = null;
            var server = self.app.getServerById(id);
            var stopFlags = self.app.get(Constants.RESERVED.STOP_SERVERS) || [];
            if (!!server && (server[Constants.RESERVED.AUTO_RESTART] === 'true' || server[Constants.RESERVED.RESTART_FORCE] === 'true') && stopFlags.indexOf(id) < 0) {
                var setTimer = function (time) {
                    pingTimer = setTimeout(function () {
                        utils.ping(server.host, function (flag) {
                            if (flag) {
                                handle();
                            }
                            else {
                                count++;
                                if (count > 3) {
                                    time = Constants.TIME.TIME_WAIT_MAX_PING;
                                }
                                else {
                                    time = Constants.TIME.TIME_WAIT_PING * count;
                                }
                                setTimer(time);
                            }
                        });
                    }, time);
                };
                setTimer(time);
                var handle = function () {
                    clearTimeout(pingTimer);
                    utils.checkPort(server, function (status) {
                        if (status === 'error') {
                            utils.invokeCallback(cb, new Error('Check port command executed with error.'));
                            return;
                        }
                        else if (status === 'busy') {
                            if (!!server[Constants.RESERVED.RESTART_FORCE]) {
                                starter.kill([info.pid], [server]);
                            }
                            else {
                                utils.invokeCallback(cb, new Error('Port occupied already, check your server to add.'));
                                return;
                            }
                        }
                        setTimeout(function () {
                            starter.run(self.app, server, null);
                        }, Constants.TIME.TIME_WAIT_STOP);
                    });
                };
            }
        });
        // monitor servers register event
        this.masterConsole.on('register', function (record) {
            starter.bindCpu(record.id, record.pid, record.host);
        });
        this.masterConsole.on('admin-log', function (log, error) {
            if (error) {
                adminLogger.error(JSON.stringify(log));
            }
            else {
                adminLogger.info(JSON.stringify(log));
            }
        });
    }
    ;
    stop(cb) {
        this.masterConsole.stop();
        process.nextTick(cb);
    }
    ;
}
exports.MasterServer = MasterServer;
//# sourceMappingURL=master.js.map