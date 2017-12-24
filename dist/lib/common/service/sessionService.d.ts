/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * Session service maintains the internal session for each client connection.
 *
 * Session service is created by session component and is only
 * <b>available</b> in frontend servers. You can access the service by
 * `app.get('sessionService')` or `app.sessionService` in frontend servers.
 *
 * @param {Object} opts constructor parameters
 * @class
 * @constructor
 */
export declare class SessionService {
    singleSession: Session;
    sessions: {
        [sid: number]: Session;
    };
    uidMap: {
        [uid: string]: Session[];
    };
    constructor(opts: any);
    /**
     * Create and return internal session.
     *
     * @param {Integer} sid uniqe id for the internal session
     * @param {String} frontendId frontend server in which the internal session is created
     * @param {Object} socket the underlying socket would be held by the internal session
     *
     * @return {Session}
     *
     * @memberOf SessionService
     * @api private
     */
    create(sid: any, frontendId: any, socket: any): Session;
    /**
     * Bind the session with a user id.
     *
     * @memberOf SessionService
     * @api private
     */
    bind(sid: any, uid: any, cb: (err: Error | null, result?: void) => void): void;
    /**
     * Unbind a session with the user id.
     *
     * @memberOf SessionService
     * @api private
     */
    unbind(sid: any, uid: any, cb: (err?: Error, result?: void) => void): void;
    /**
     * Get session by id.
     *
     * @param {Number} id The session id
     * @return {Session}
     *
     * @memberOf SessionService
     * @api private
     */
    get(sid: any): Session;
    /**
     * Get sessions by userId.
     *
     * @param {Number} uid User id associated with the session
     * @return {Array} list of session binded with the uid
     *
     * @memberOf SessionService
     * @api private
     */
    getByUid(uid: any): Session[];
    /**
     * Remove session by key.
     *
     * @param {Number} sid The session id
     *
     * @memberOf SessionService
     * @api private
     */
    remove(sid: any): void;
    /**
     * Import the key/value into session.
     *
     * @api private
     */
    import(sid: any, key: any, value: any, cb: (err?: Error, result?: void) => void): void;
    /**
     * Import new value for the existed session.
     *
     * @memberOf SessionService
     * @api private
     */
    importAll(sid: any, settings: any, cb: (err?: Error, result?: void) => void): void;
    /**
     * Kick all the session offline under the user id.
     *
     * @param {Number}   uid user id asscociated with the session
     * @param {Function} cb  callback function
     *
     * @memberOf SessionService
     */
    kick(uid: string, reason?: string, cb?: (err?: Error, result?: void) => void): void;
    /**
     * Kick a user offline by session id.
     *
     * @param {Number}   sid session id
     * @param {Function} cb  callback function
     *
     * @memberOf SessionService
     */
    kickBySessionId(sid: number, reason?: string, cb?: (err?: Error, result?: void) => void): void;
    /**
     * Get client remote address by session id.
     *
     * @param {Number}   sid session id
     * @return {Object} remote address of client
     *
     * @memberOf SessionService
     */
    getClientAddressBySessionId(sid: number): any;
    /**
     * Send message to the client by session id.
     *
     * @param {String} sid session id
     * @param {Object} msg message to send
     *
     * @memberOf SessionService
     * @api private
     */
    sendMessage(sid: number, msg: any): boolean;
    /**
     * Send message to the client by user id.
     *
     * @param {String} uid userId
     * @param {Object} msg message to send
     *
     * @memberOf SessionService
     * @api private
     */
    sendMessageByUid(uid: number, msg: any): boolean;
    /**
     * Iterate all the session in the session service.
     *
     * @param  {Function} cb callback function to fetch session
     * @api private
     */
    forEachSession(cb: any): void;
    /**
     * Iterate all the binded session in the session service.
     *
     * @param  {Function} cb callback function to fetch session
     * @api private
     */
    forEachBindedSession(cb: any): void;
    /**
     * Get sessions' quantity in specified server.
     *
     */
    getSessionsCount(): number;
    akick: (uid: string, reason?: string) => Promise<void>;
    akickBySessionId: (sid: number, reason?: string) => Promise<void>;
    abind: (sid: number, uid: string) => Promise<void>;
    aunbind: (sid: number, uid: string) => Promise<void>;
    aimport: (sid: number, key: string, value: any) => Promise<void>;
    aimportAll: (sid: number, settings: any) => Promise<void>;
}
/**
 * Session maintains the relationship between client connection and user information.
 * There is a session associated with each client connection. And it should bind to a
 * user id after the client passes the identification.
 *
 * Session is created in frontend server and should not be accessed in handler.
 * There is a proxy class called BackendSession in backend servers and FrontendSession
 * in frontend servers.
 */
export declare class Session extends EventEmitter {
    id: number;
    frontendId: string;
    uid: string;
    settings: any;
    __socket__: any;
    private __sessionService__;
    private __state__;
    constructor(sid: any, frontendId: any, socket: any, service: any);
    toFrontendSession(): FrontendSession;
    /**
     * Bind the session with the the uid.
     *
     * @param {Number} uid User id
     * @api public
     */
    bind(uid: any): void;
    /**
     * Unbind the session with the the uid.
     *
     * @param {Number} uid User id
     * @api private
     */
    unbind(uid: any): void;
    /**
     * Set values (one or many) for the session.
     *
     * @param {String|Object} key session key
     * @param {Object} value session value
     * @api public
     */
    set(key: any, value: any): void;
    /**
     * Remove value from the session.
     *
     * @param {String} key session key
     * @api public
     */
    remove(key: any): void;
    /**
     * Get value from the session.
     *
     * @param {String} key session key
     * @return {Object} value associated with session key
     * @api public
     */
    get(key: any): any;
    /**
     * Send message to the session.
     *
     * @param  {Object} msg final message sent to client
     */
    send(msg: any): void;
    /**
     * Send message to the session in batch.
     *
     * @param  {Array} msgs list of message
     */
    sendBatch(msgs: any): void;
    /**
     * Closed callback for the session which would disconnect client in next tick.
     *
     * @api public
     */
    closed(reason: any): void;
}
/**
 * Frontend session for frontend server.
 */
export declare class FrontendSession extends EventEmitter {
    id: number;
    uid: string;
    frontendId: string;
    settings: any;
    private __session__;
    private __sessionService__;
    constructor(session: any);
    bind(uid: any, cb: (err?: Error, result?: void) => void): void;
    unbind(uid: any, cb: (err?: Error, result?: void) => void): void;
    set(key: any, value: any): void;
    get(key: any): any;
    push(key: any, cb: (err?: Error, result?: void) => void): void;
    pushAll(cb: (err?: Error, result?: void) => void): void;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
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
