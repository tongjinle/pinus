import { RpcClient } from 'pinus-rpc';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
/**
 * Proxy component class
 *
 * @param {Object} app  current application context
 * @param {Object} opts construct parameters
 */
export declare class ProxyComponent implements IComponent {
    app: Application;
    opts: any;
    client: RpcClient;
    constructor(app: any, opts: any);
    name: string;
    /**
     * Proxy component lifecycle function
     *
     * @param {Function} cb
     * @return {Void}
     */
    start(cb: any): void;
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    afterStart(cb: any): void;
    /**
     * Add remote server to the rpc client.
     *
     * @param {Array} servers server info list, {id, serverType, host, port}
     */
    addServers(servers: any): void;
    /**
     * Remove remote server from the rpc client.
     *
     * @param  {Array} ids server id list
     */
    removeServers(ids: any): void;
    /**
     * Replace remote servers from the rpc client.
     *
     * @param  {Array} ids server id list
     */
    replaceServers(servers: any): void;
    /**
     * Proxy for rpc client rpcInvoke.
     *
     * @param {String}   serverId remote server id
     * @param {Object}   msg      rpc message: {serverType: serverType, service: serviceName, method: methodName, args: arguments}
     * @param {Function} cb      callback function
     */
    rpcInvoke(serverId: any, msg: any, cb: any): void;
}
