import { Application } from '../../application';
import { IComponent } from '../../interfaces/Component';
/**
 * Service that maintains backend sessions and the communication with frontend
 * servers.
 *
 * BackendSessionService would be created in each server process and maintains
 * backend sessions for current process and communicates with the relative
 * frontend servers.
 *
 * BackendSessionService instance could be accessed by
 * `app.get('backendSessionService')` or app.backendSessionService.
 *
 * @class
 * @constructor
 */
export declare class BackendSessionService implements IComponent {
    app: Application;
    name: string;
    constructor(app: any);
    create(opts: any): BackendSession;
    /**
     * Get backend session by frontend server id and session id.
     *
     * @param  {String}   frontendId frontend server id that session attached
     * @param  {String}   sid        session id
     * @param  {Function} cb         callback function. args: cb(err, BackendSession)
     *
     * @memberOf BackendSessionService
     */
    get(frontendId: any, sid: any, cb: (err: Error | null, result?: BackendSession) => void): void;
    /**
     * Get backend sessions by frontend server id and user id.
     *
     * @param  {String}   frontendId frontend server id that session attached
     * @param  {String}   uid        user id binded with the session
     * @param  {Function} cb         callback function. args: cb(err, BackendSessions)
     *
     * @memberOf BackendSessionService
     */
    getByUid(frontendId: any, uid: any, cb: (err: Error | null, result?: BackendSession[]) => void): void;
    /**
     * Kick a session by session id.
     *
     * @param  {String}   frontendId cooperating frontend server id
     * @param  {Number}   sid        session id
     * @param  {Function} cb         callback function
     *
     * @memberOf BackendSessionService
     */
    kickBySid(frontendId: any, sid: any, reason: any, cb: (err: Error | null, result?: void) => void): void;
    /**
     * Kick sessions by user id.
     *
     * @param  {String}          frontendId cooperating frontend server id
     * @param  {Number|String}   uid        user id
     * @param  {String}          reason     kick reason
     * @param  {Function}        cb         callback function
     *
     * @memberOf BackendSessionService
     */
    kickByUid(frontendId: any, uid: any, reason: any, cb: (err: Error | null, result?: void) => void): void;
    /**
     * Bind the session with the specified user id. It would finally invoke the
     * the sessionService.bind in the cooperating frontend server.
     *
     * @param  {String}   frontendId cooperating frontend server id
     * @param  {Number}   sid        session id
     * @param  {String}   uid        user id
     * @param  {Function} cb         callback function
     *
     * @memberOf BackendSessionService
     * @api private
     */
    bind(frontendId: any, sid: any, uid: any, cb: (err: Error | null, result?: void) => void): void;
    /**
     * Unbind the session with the specified user id. It would finally invoke the
     * the sessionService.unbind in the cooperating frontend server.
     *
     * @param  {String}   frontendId cooperating frontend server id
     * @param  {Number}   sid        session id
     * @param  {String}   uid        user id
     * @param  {Function} cb         callback function
     *
     * @memberOf BackendSessionService
     * @api private
     */
    unbind(frontendId: any, sid: any, uid: any, cb: (err: Error | null, result?: void) => void): void;
    /**
     * Push the specified customized change to the frontend internal session.
     *
     * @param  {String}   frontendId cooperating frontend server id
     * @param  {Number}   sid        session id
     * @param  {String}   key        key in session that should be push
     * @param  {Object}   value      value in session, primitive js object
     * @param  {Function} cb         callback function
     *
     * @memberOf BackendSessionService
     * @api private
     */
    push(frontendId: any, sid: any, key: any, value: any, cb: (err: Error | null, result?: void) => void): void;
    /**
     * Push all the customized changes to the frontend internal session.
     *
     * @param  {String}   frontendId cooperating frontend server id
     * @param  {Number}   sid        session id
     * @param  {Object}   settings   key/values in session that should be push
     * @param  {Function} cb         callback function
     *
     * @memberOf BackendSessionService
     * @api private
     */
    pushAll(frontendId: any, sid: any, settings: any, cb: (err: Error | null, result?: void) => void): void;
    aget: (arg1: any, arg2: any) => Promise<BackendSession>;
    agetByUid: (arg1: any, arg2: any) => Promise<BackendSession[]>;
    akickBySid: (arg1: any, arg2: any, arg3: any) => Promise<void>;
    akickByUid: (arg1: any, arg2: any, arg3: any) => Promise<void>;
    abind: (arg1: any, arg2: any, arg3: any) => Promise<void>;
    aunbind: (arg1: any, arg2: any, arg3: any) => Promise<void>;
    apush: (arg1: any, arg2: any, arg3: any, arg4: any) => Promise<void>;
    apushAll: (arg1: any, arg2: any, arg3: any) => Promise<void>;
}
/**
 * BackendSession is the proxy for the frontend internal session passed to handlers and
 * it helps to keep the key/value pairs for the server locally.
 * Internal session locates in frontend server and should not be accessed directly.
 *
 * The mainly operation on backend session should be read and any changes happen in backend
 * session is local and would be discarded in next request. You have to push the
 * changes to the frontend manually if necessary. Any push would overwrite the last push
 * of the same key silently and the changes would be saw in next request.
 * And you have to make sure the transaction outside if you would push the session
 * concurrently in different processes.
 *
 * See the api below for more details.
 *
 * @class
 * @constructor
 */
export declare class BackendSession {
    id: number;
    frontendId: string;
    uid: string;
    settings: any;
    __sessionService__: BackendSessionService;
    constructor(opts: any, service: BackendSessionService);
    /**
     * Bind current session with the user id. It would push the uid to frontend
     * server and bind  uid to the frontend internal session.
     *
     * @param  {Number|String}   uid user id
     * @param  {Function} cb  callback function
     *
     * @memberOf BackendSession
     */
    bind(uid: any, cb: (err: Error | null, result?: void) => void): void;
    /**
     * Unbind current session with the user id. It would push the uid to frontend
     * server and unbind uid from the frontend internal session.
     *
     * @param  {Number|String}   uid user id
     * @param  {Function} cb  callback function
     *
     * @memberOf BackendSession
     */
    unbind(uid: any, cb: (err: Error | null, result?: void) => void): void;
    /**
     * Set the key/value into backend session.
     *
     * @param {String} key   key
     * @param {Object} value value
     */
    set(key: any, value: any): void;
    /**
     * Get the value from backend session by key.
     *
     * @param  {String} key key
     * @return {Object}     value
     */
    get(key: any): any;
    /**
     * Push the key/value in backend session to the front internal session.
     *
     * @param  {String}   key key
     * @param  {Function} cb  callback function
     */
    push(key: any, cb: (err: Error | null, result?: void) => void): void;
    /**
     * Push all the key/values in backend session to the frontend internal session.
     *
     * @param  {Function} cb callback function
     */
    pushAll(cb: (err: Error | null, result?: void) => void): void;
    abind: (arg1: any) => Promise<void>;
    aunbind: (arg1: any) => Promise<void>;
    apush: (arg1: any) => Promise<void>;
    apushAll: () => Promise<void>;
    /**
     * Export the key/values for serialization.
     *
     * @api private
     */
    export(): {};
}
