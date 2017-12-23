/**
 * Component for remote service.
 * Load remote service and add to global context.
 */
import * as fs from 'fs';
import * as pathUtil from '../util/pathUtil';
import { RemoteServer } from 'pomelo-rpc';
import { Application } from '../application';

/**
 * Remote component factory function
 *
 * @param {Object} app  current application context
 * @param {Object} opts construct parameters
 *                       opts.acceptorFactory {Object}: acceptorFactory.create(opts, cb)
 * @return {Object}     remote component instances
 */
export default function (app, opts)
{
    opts = opts || {};

    // cacheMsg is deprecated, just for compatibility here.
    opts.bufferMsg = opts.bufferMsg || opts.cacheMsg || false;
    opts.interval = opts.interval || 30;
    if (app.enabled('rpcDebugLog'))
    {
        opts.rpcDebugLog = true;
        opts.rpcLogger = require('pomelo-logger').getLogger('rpc-debug', __filename);
    }
    return new RemoteComponent(app, opts);
};

/**
 * Remote component class
 *
 * @param {Object} app  current application context
 * @param {Object} opts construct parameters
 */
export class RemoteComponent 
{

    constructor(private app: Application, private opts: any)
    {
    };

    name = '__remote__';

    /**
     * Remote component lifecycle function
     *
     * @param {Function} cb
     * @return {Void}
     */
    start = function (cb)
    {
        this.opts.port = this.app.getCurServer().port;
        this.remote = genRemote(this.app, this.opts);
        this.remote.start();
        process.nextTick(cb);
    };

    /**
     * Remote component lifecycle function
     *
     * @param {Boolean}  force whether stop the component immediately
     * @param {Function}  cb
     * @return {Void}
     */
    stop = function (force, cb)
    {
        this.remote.stop(force);
        process.nextTick(cb);
    };
}
/**
 * Get remote paths from application
 *
 * @param {Object} app current application context
 * @return {Array} paths
 *
 */
var getRemotePaths = function (app)
{
    var paths = [];

    var role;
    // master server should not come here
    if (app.isFrontend())
    {
        role = 'frontend';
    } else
    {
        role = 'backend';
    }

    var sysPath = pathUtil.getSysRemotePath(role), serverType = app.getServerType();
    if (fs.existsSync(sysPath))
    {
        paths.push(pathUtil.remotePathRecord('sys', serverType, sysPath));
    }
    var userPath = pathUtil.getUserRemotePath(app.getBase(), serverType);
    if (fs.existsSync(userPath))
    {
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
var genRemote = function (app, opts)
{
    opts.paths = getRemotePaths(app);
    opts.context = app;
    if (!!opts.rpcServer)
    {
        return opts.rpcServer.create(opts);
    } else
    {
        return RemoteServer.create(opts);
    }
};
