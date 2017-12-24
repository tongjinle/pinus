import { IPushScheduler } from "../interfaces/IPushScheduler";
import { Application } from "../application";
export declare type IPushSelector = (reqId: number, route: string, msg: any, recvs: number[], opts: any) => number;
export declare class MultiPushScheduler implements IPushScheduler {
    app: Application;
    selector: IPushSelector;
    scheduler: {
        [id: number]: IPushScheduler;
    };
    constructor(app: any, opts: any);
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    start(): Promise<void>;
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    stop(): Promise<void>;
    /**
     * Schedule how the message to send.
     *
     * @param  {Number}   reqId request id
     * @param  {String}   route route string of the message
     * @param  {Object}   msg   message content after encoded
     * @param  {Array}    recvs array of receiver's session id
     * @param  {Object}   opts  options
     */
    schedule(reqId: any, route: any, msg: any, recvs: any, opts: any, cb: any): void;
}
