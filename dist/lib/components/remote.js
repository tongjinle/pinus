"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for remote service.
 * Load remote service and add to global context.
 */
const fs = require("fs");
const pathUtil = require("../util/pathUtil");
const pinus_rpc_1 = require("pinus-rpc");
const pinus_logger_1 = require("pinus-logger");
/**
 * Remote component class
 *
 * @param {Object} app  current application context
 * @param {Object} opts construct parameters
 */
class RemoteComponent {
    constructor(app, opts) {
        this.app = app;
        this.name = '__remote__';
        opts = opts || {};
        this.opts = opts;
        // cacheMsg is deprecated, just for compatibility here.
        opts.bufferMsg = opts.bufferMsg || opts.cacheMsg || false;
        opts.interval = opts.interval || 30;
        if (app.enabled('rpcDebugLog')) {
            opts.rpcDebugLog = true;
            opts.rpcLogger = pinus_logger_1.getLogger('rpc-debug', __filename);
        }
    }
    ;
    /**
     * Remote component lifecycle function
     *
     * @param {Function} cb
     * @return {Void}
     */
    start(cb) {
        this.opts.port = this.app.getCurServer().port;
        this.remote = genRemote(this.app, this.opts);
        this.remote.start();
        process.nextTick(cb);
    }
    ;
    /**
     * Remote component lifecycle function
     *
     * @param {Boolean}  force whether stop the component immediately
     * @param {Function}  cb
     * @return {Void}
     */
    stop(force, cb) {
        this.remote.stop(force);
        process.nextTick(cb);
    }
    ;
}
exports.RemoteComponent = RemoteComponent;
/**
 * Get remote paths from application
 *
 * @param {Object} app current application context
 * @return {Array} paths
 *
 */
var getRemotePaths = function (app) {
    var paths = [];
    var role;
    // master server should not come here
    if (app.isFrontend()) {
        role = 'frontend';
    }
    else {
        role = 'backend';
    }
    var sysPath = pathUtil.getSysRemotePath(role), serverType = app.getServerType();
    if (fs.existsSync(sysPath)) {
        paths.push(pathUtil.remotePathRecord('sys', serverType, sysPath));
    }
    var userPath = pathUtil.getUserRemotePath(app.getBase(), serverType);
    if (fs.existsSync(userPath)) {
        paths.push(pathUtil.remotePathRecord('user', serverType, userPath));
    }
    return paths;
};
/**
 * Generate remote server instance
 *
 * @param {Object} app current application context
 * @param {Object} opts contructor parameters for rpc Server
 * @return {Object} remote server instance
 */
var genRemote = function (app, opts) {
    opts.paths = getRemotePaths(app);
    opts.context = app;
    if (!!opts.rpcServer) {
        return opts.rpcServer.create(opts);
    }
    else {
        return pinus_rpc_1.createServer(opts);
    }
};
//# sourceMappingURL=remote.js.map