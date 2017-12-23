import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
/**
 * Connector component. Receive client requests and attach session with socket.
 *
 * @param {Object} app  current application context
 * @param {Object} opts attach parameters
 *                      opts.connector {Object} provides low level network and protocol details implementation between server and clients.
 */
export declare class ConnectorComponent implements IComponent {
    app: Application;
    connector: any;
    encode: any;
    decode: any;
    useCrypto: boolean;
    useHostFilter: boolean;
    useAsyncCoder: boolean;
    blacklistFun: Function;
    keys: {};
    blacklist: any[];
    server: any;
    session: any;
    constructor(app: any, opts: any);
    name: string;
    start(cb: any): void;
    afterStart(cb: any): void;
    stop(force: any, cb: any): void;
    send(reqId: any, route: any, msg: any, recvs: any, opts: any, cb: any): void;
    sendAsync(reqId: any, route: any, msg: any, recvs: any, opts: any, cb: any): void;
    doSend(reqId: any, route: any, emsg: any, recvs: any, opts: any, cb: any): void;
    setPubKey(id: any, key: any): void;
    getPubKey(id: any): any;
}
