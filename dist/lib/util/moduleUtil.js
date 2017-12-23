"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const admin = require("pomelo-admin");
const utils = require("./utils");
const Constants = require("./constants");
const pathUtil = require("./pathUtil");
const starter = require("../master/starter");
const pomelo_logger_1 = require("pomelo-logger");
const masterwatcher_1 = require("../modules/masterwatcher");
const monitorwatcher_1 = require("../modules/monitorwatcher");
const console_1 = require("../modules/console");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
/**
 * Load admin modules
 */
function loadModules(self, consoleService) {
    // load app register modules
    var _modules = self.app.get(Constants.KEYWORDS.MODULE);
    if (!_modules) {
        return;
    }
    var modules = [];
    for (var m in _modules) {
        modules.push(_modules[m]);
    }
    var record, moduleId, module;
    for (var i = 0, l = modules.length; i < l; i++) {
        record = modules[i];
        if (typeof record.module === 'function') {
            module = new record.module(record.opts, consoleService);
        }
        else {
            module = record.module;
        }
        moduleId = record.moduleId || module.moduleId;
        if (!moduleId) {
            logger.warn('ignore an unknown module.');
            continue;
        }
        consoleService.register(moduleId, module);
        self.modules.push(module);
    }
}
exports.loadModules = loadModules;
;
function startModules(modules, cb) {
    // invoke the start lifecycle method of modules
    if (!modules) {
        return;
    }
    startModule(null, modules, 0, cb);
}
exports.startModules = startModules;
;
/**
 * Append the default system admin modules
 */
function registerDefaultModules(isMaster, app, closeWatcher) {
    if (!closeWatcher) {
        if (isMaster) {
            app.registerAdmin(masterwatcher_1.MasterWatcherModule, { app: app });
        }
        else {
            app.registerAdmin(monitorwatcher_1.MonitorWatcherModule, { app: app });
        }
    }
    app.registerAdmin(admin.modules.watchServer, { app: app });
    app.registerAdmin(console_1.ConsoleModule, { app: app, starter: starter });
    if (app.enabled('systemMonitor')) {
        if (os.platform() !== Constants.PLATFORM.WIN) {
            app.registerAdmin(admin.modules.systemInfo);
            app.registerAdmin(admin.modules.nodeInfo);
        }
        app.registerAdmin(admin.modules.monitorLog, { path: pathUtil.getLogPath(app.getBase()) });
        app.registerAdmin(admin.modules.scripts, { app: app, path: pathUtil.getScriptPath(app.getBase()) });
        if (os.platform() !== Constants.PLATFORM.WIN) {
            app.registerAdmin(admin.modules.profiler);
        }
    }
}
exports.registerDefaultModules = registerDefaultModules;
;
var startModule = function (err, modules, index, cb) {
    if (err || index >= modules.length) {
        utils.invokeCallback(cb, err);
        return;
    }
    var module = modules[index];
    if (module && typeof module.start === 'function') {
        module.start(function (err) {
            startModule(err, modules, index + 1, cb);
        });
    }
    else {
        startModule(err, modules, index + 1, cb);
    }
};
//# sourceMappingURL=moduleUtil.js.map