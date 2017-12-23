import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
export declare class PushSchedulerComponent implements IComponent {
    private app;
    scheduler: any;
    constructor(app: Application, opts: any);
    name: string;
    isSelectable: boolean;
    selector: Function;
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    afterStart(cb: any): void;
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    stop(force: any, cb: any): void;
    /**
     * Schedule how the message to send.
     *
     * @param  {Number}   reqId request id
     * @param  {String}   route route string of the message
     * @param  {Object}   msg   message content after encoded
     * @param  {Array}    recvs array of receiver's session id
     * @param  {Object}   opts  options
     * @param  {Function} cb
     */
    schedule(reqId: any, route: any, msg: any, recvs: any, opts: any, cb: any): void;
}
