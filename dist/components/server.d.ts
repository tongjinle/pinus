/**
 * Component for server starup.
 */
import { Server } from '../server/server';
/**
 * Component factory function
 *
 * @param {Object} app  current application context
 * @return {Object}     component instance
 */
export default function (app: any, opts: any): ServerComponent;
/**
 * Server component class
 *
 * @param {Object} app  current application context
 */
export declare class ServerComponent {
    server: Server;
    constructor(app: any, opts: any);
    name: string;
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    start: (cb: any) => void;
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    afterStart: (cb: any) => void;
    /**
     * Component lifecycle function
     *
     * @param {Boolean}  force whether stop the component immediately
     * @param {Function}  cb
     * @return {Void}
     */
    stop: (force: any, cb: any) => void;
    /**
     * Proxy server handle
     */
    handle: (msg: any, session: any, cb: any) => void;
    /**
     * Proxy server global handle
     */
    globalHandle: (msg: any, session: any, cb: any) => void;
}
