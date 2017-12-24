import { Application } from '../../../application';
export default function (app: any): ChannelRemote;
export declare class ChannelRemote {
    app: Application;
    constructor(app: any);
    /**
     * Push message to client by uids.
     *
     * @param  {String}   route route string of message
     * @param  {Object}   msg   message
     * @param  {Array}    uids  user ids that would receive the message
     * @param  {Object}   opts  push options
     * @param  {Function} cb    callback function
     */
    pushMessage: (arg1: any, arg2: any, arg3: any, arg4: any) => Promise<any>;
    /**
     * Broadcast to all the client connectd with current frontend server.
     *
     * @param  {String}    route  route string
     * @param  {Object}    msg    message
     * @param  {Boolean}   opts   broadcast options.
     * @param  {Function}  cb     callback function
     */
    broadcast: (arg1: any, arg2: any, arg3: any) => Promise<any>;
}
