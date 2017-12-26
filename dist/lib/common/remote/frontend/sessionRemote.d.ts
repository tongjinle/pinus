import { Application } from '../../../application';
export default function (app: any): SessionRemote;
export declare class SessionRemote {
    app: Application;
    constructor(app: any);
    bind(sid: any, uid: any): Promise<void>;
    unbind: (arg1: any, arg2: any) => Promise<void>;
    push: (arg1: any, arg2: any, arg3: any) => Promise<void>;
    pushAll: (arg1: any, arg2: any) => Promise<void>;
    /**
     * Get session informations with session id.
     *
     * @param  {String}   sid session id binded with the session
     * @param  {Function} cb(err, sinfo)  callback funtion, sinfo would be null if the session not exist.
     */
    getBackendSessionBySid: (arg1: any) => Promise<any>;
    /**
     * Get all the session informations with the specified user id.
     *
     * @param  {String}   uid user id binded with the session
     * @param  {Function} cb(err, sinfo)  callback funtion, sinfo would be null if the session does not exist.
     */
    getBackendSessionsByUid: (arg1: any) => Promise<any>;
    /**
     * Kick a session by session id.
     *
     * @param  {Number}   sid session id
     * @param  {String}   reason  kick reason
     * @param  {Function} cb  callback function
     */
    kickBySid: (arg1: any, arg2: any) => Promise<void>;
    /**
     * Kick sessions by user id.
     *
     * @param  {Number|String}   uid user id
     * @param  {String}          reason     kick reason
     * @param  {Function} cb     callback function
     */
    kickByUid: (arg1: any, arg2: any) => Promise<void>;
}
