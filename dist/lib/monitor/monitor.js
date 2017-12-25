"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for monitor.
 * Load and start monitor client.
 */
const pinus_logger_1 = require("pinus-logger");
var logger = pinus_logger_1.getLogger('pinus', __filename);
const admin = require("pinus-admin");
const moduleUtil = require("../util/moduleUtil");
const utils = require("../util/utils");
const Constants = require("../util/constants");
class Monitor {
    constructor(app, opts) {
        this.modules = [];
        opts = opts || {};
        this.app = app;
        this.serverInfo = app.getCurServer();
        this.masterInfo = app.getMaster();
        this.closeWatcher = opts.closeWatcher;
        this.monitorConsole = admin.createMonitorConsole({
            id: this.serverInfo.id,
            type: this.app.getServerType(),
            host: this.masterInfo.host,
            port: this.masterInfo.port,
            info: this.serverInfo,
            env: this.app.get(Constants.RESERVED.ENV),
            authServer: app.get('adminAuthServerMonitor') // auth server function
        });
    }
    ;
    start(cb) {
        moduleUtil.registerDefaultModules(false, this.app, this.closeWatcher);
        this.startConsole(cb);
    }
    ;
    startConsole(cb) {
        moduleUtil.loadModules(this, this.monitorConsole);
        var self = this;
        this.monitorConsole.start(function (err) {
            if (err) {
                utils.invokeCallback(cb, err);
                return;
            }
            moduleUtil.startModules(self.modules, function (err) {
                utils.invokeCallback(cb, err);
                return;
            });
        });
        this.monitorConsole.on('error', function (err) {
            if (!!err) {
                logger.error('monitorConsole encounters with error: %j', err.stack);
                return;
            }
        });
    }
    ;
    stop(cb) {
        this.monitorConsole.stop();
        this.modules = [];
        process.nextTick(function () {
            utils.invokeCallback(cb);
        });
    }
    ;
    // monitor reconnect to master
    reconnect(masterInfo) {
        var self = this;
        this.stop(function () {
            self.monitorConsole = admin.createMonitorConsole({
                id: self.serverInfo.id,
                type: self.app.getServerType(),
                host: masterInfo.host,
                port: masterInfo.port,
                info: self.serverInfo,
                env: self.app.get(Constants.RESERVED.ENV)
            });
            self.startConsole(function () {
                logger.info('restart modules for server : %j finish.', self.app.serverId);
            });
        });
    }
    ;
}
exports.Monitor = Monitor;
//# sourceMappingURL=monitor.js.map