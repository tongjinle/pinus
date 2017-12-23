/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * Connector that manager low level connection and protocol bewteen server and client.
 * Develper can provide their own connector to switch the low level prototol, such as tcp or probuf.
 */
export declare class SIOConnector extends EventEmitter {
    port: number;
    host: string;
    opts: any;
    heartbeats: any;
    closeTimeout: number;
    heartbeatTimeout: number;
    heartbeatInterval: number;
    constructor(port: any, host: any, opts: any);
    /**
     * Start connector to listen the specified port
     */
    start(cb: any): void;
    /**
     * Stop connector
     */
    stop(force: any, cb: any): void;
    encode(reqId: any, route: any, msg: any): string | {
        id: any;
        body: any;
    };
    /**
     * Decode client message package.
     *
     * Package format:
     *   message id: 4bytes big-endian integer
     *   route length: 1byte
     *   route: route length bytes
     *   body: the rest bytes
     *
     * @param  {String} data socket.io package from client
     * @return {Object}      message object
     */
    decode(msg: any): {
        id: number;
        route: any;
        body: any;
    };
}
