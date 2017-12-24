import { Application } from '../../../application';
/**
 * Remote service for backend servers.
 * Receive and handle request message forwarded from frontend server.
 */
export default function (app: any): MsgRemote;
export declare class MsgRemote {
    app: Application;
    constructor(app: any);
    /**
     * Forward message from frontend server to other server's handlers
     *
     * @param msg {Object} request message
     * @param session {Object} session object for current request
     * @param cb {Function} callback function
     */
    forwardMessage: (arg1: any, arg2: any) => Promise<any>;
    forwardMessage2: (arg1: any, arg2: any, arg3: any, arg4: any, arg5: any) => Promise<any>;
}
