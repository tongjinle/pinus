/**
 * Component for server starup.
 */
import { Server , create as createServer } from '../server/server';

/**
 * Component factory function
 *
 * @param {Object} app  current application context
 * @return {Object}     component instance
 */
export default function(app, opts) {
	return new ServerComponent(app, opts);
};

/**
 * Server component class
 *
 * @param {Object} app  current application context
 */
export class ServerComponent 
{
    server: Server;
    constructor(app, opts)
    {
        this.server = createServer(app, opts);
    };
    name = '__server__';

    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    start(cb)
    {
        this.server.start();
        process.nextTick(cb);
    };

    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    afterStart(cb)
    {
        this.server.afterStart();
        process.nextTick(cb);
    };

    /**
     * Component lifecycle function
     *
     * @param {Boolean}  force whether stop the component immediately
     * @param {Function}  cb
     * @return {Void}
     */
    stop(force, cb)
    {
        this.server.stop();
        process.nextTick(cb);
    };

    /**
     * Proxy server handle
     */
    handle(msg, session, cb)
    {
        this.server.handle(msg, session, cb);
    };

    /**
     * Proxy server global handle
     */
    globalHandle(msg, session, cb)
    {
        this.server.globalHandle(msg, session, cb);
    };
}