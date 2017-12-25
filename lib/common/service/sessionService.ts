import { EventEmitter } from 'events';
import * as  util from 'util';
import { getLogger } from 'pinus-logger'; var logger = getLogger('pinus', __filename);
import * as utils from '../../util/utils';

var FRONTEND_SESSION_FIELDS = ['id', 'frontendId', 'uid', '__sessionService__'];
var EXPORTED_SESSION_FIELDS = ['id', 'frontendId', 'uid', 'settings'];

var ST_INITED = 0;
var ST_CLOSED = 1;


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
export class SessionService
{
    singleSession: Session;
    sessions: { [sid: number]: Session };
    uidMap: { [uid: string]: Session[] };

    constructor(opts)
    {
        opts = opts || {};
        this.singleSession = opts.singleSession;
        this.sessions = {};     // sid -> session
        this.uidMap = {};       // uid -> sessions
    };

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
    create(sid, frontendId, socket)
    {
        var session = new Session(sid, frontendId, socket, this);
        this.sessions[session.id] = session;

        return session;
    };

    /**
     * Bind the session with a user id.
     *
     * @memberOf SessionService
     * @api private
     */
    bind(sid, uid, cb : (err : Error | null , result ?: void)=>void)
    {
        var session = this.sessions[sid];

        if (!session)
        {
            process.nextTick(function ()
            {
                cb(new Error('session does not exist, sid: ' + sid));
            });
            return;
        }

        if (session.uid)
        {
            if (session.uid === uid)
            {
                // already bound with the same uid
                cb(null);
                return;
            }

            // already bound with other uid
            process.nextTick(function ()
            {
                cb(new Error('session has already bound with ' + session.uid));
            });
            return;
        }

        var sessions = this.uidMap[uid];

        if (!!this.singleSession && !!sessions)
        {
            process.nextTick(function ()
            {
                cb(new Error('singleSession is enabled, and session has already bound with uid: ' + uid));
            });
            return;
        }

        if (!sessions)
        {
            sessions = this.uidMap[uid] = [];
        }

        for (var i = 0, l = sessions.length; i < l; i++)
        {
            // session has binded with the uid
            if (sessions[i].id === session.id)
            {
                process.nextTick(cb);
                return;
            }
        }
        sessions.push(session);

        session.bind(uid);

        if (cb)
        {
            process.nextTick(cb);
        }
    };

    /**
     * Unbind a session with the user id.
     *
     * @memberOf SessionService
     * @api private
     */
    unbind(sid, uid, cb : (err ?: Error , result ?: void)=>void)
    {
        var session = this.sessions[sid];

        if (!session)
        {
            process.nextTick(function ()
            {
                cb(new Error('session does not exist, sid: ' + sid));
            });
            return;
        }

        if (!session.uid || session.uid !== uid)
        {
            process.nextTick(function ()
            {
                cb(new Error('session has not bind with ' + session.uid));
            });
            return;
        }

        var sessions = this.uidMap[uid], sess;
        if (sessions)
        {
            for (var i = 0, l = sessions.length; i < l; i++)
            {
                sess = sessions[i];
                if (sess.id === sid)
                {
                    sessions.splice(i, 1);
                    break;
                }
            }

            if (sessions.length === 0)
            {
                delete this.uidMap[uid];
            }
        }
        session.unbind(uid);

        if (cb)
        {
            process.nextTick(cb);
        }
    };

    /**
     * Get session by id.
     *
     * @param {Number} id The session id
     * @return {Session}
     *
     * @memberOf SessionService
     * @api private
     */
    get(sid)
    {
        return this.sessions[sid];
    };

    /**
     * Get sessions by userId.
     *
     * @param {Number} uid User id associated with the session
     * @return {Array} list of session binded with the uid
     *
     * @memberOf SessionService
     * @api private
     */
    getByUid(uid)
    {
        return this.uidMap[uid];
    };

    /**
     * Remove session by key.
     *
     * @param {Number} sid The session id
     *
     * @memberOf SessionService
     * @api private
     */
    remove(sid)
    {
        var session = this.sessions[sid];
        if (session)
        {
            var uid = session.uid;
            delete this.sessions[session.id];

            var sessions = this.uidMap[uid];
            if (!sessions)
            {
                return;
            }

            for (var i = 0, l = sessions.length; i < l; i++)
            {
                if (sessions[i].id === sid)
                {
                    sessions.splice(i, 1);
                    if (sessions.length === 0)
                    {
                        delete this.uidMap[uid];
                    }
                    break;
                }
            }
        }
    };

    /**
     * Import the key/value into session.
     *
     * @api private
     */
    import(sid, key, value, cb : (err ?: Error , result ?: void)=>void)
    {
        var session = this.sessions[sid];
        if (!session)
        {
            utils.invokeCallback(cb, new Error('session does not exist, sid: ' + sid));
            return;
        }
        session.set(key, value);
        utils.invokeCallback(cb);
    };

    /**
     * Import new value for the existed session.
     *
     * @memberOf SessionService
     * @api private
     */
    importAll(sid, settings, cb : (err ?: Error , result ?: void)=>void)
    {
        var session = this.sessions[sid];
        if (!session)
        {
            utils.invokeCallback(cb, new Error('session does not exist, sid: ' + sid));
            return;
        }

        for (var f in settings)
        {
            session.set(f, settings[f]);
        }
        utils.invokeCallback(cb);
    };

    /**
     * Kick all the session offline under the user id.
     *
     * @param {Number}   uid user id asscociated with the session
     * @param {Function} cb  callback function
     *
     * @memberOf SessionService
     */
    kick(uid : string, reason ?: string, cb ?: (err ?: Error , result ?: void)=>void)
    {
        // compatible for old kick(uid, cb);
        if (typeof reason === 'function')
        {
            cb = reason;
            reason = 'kick';
        }
        var sessions = this.getByUid(uid);

        if (sessions)
        {
            // notify client
            var sids = [];
            var self = this;
            sessions.forEach(function (session)
            {
                sids.push(session.id);
            });

            sids.forEach(function (sid)
            {
                self.sessions[sid].closed(reason);
            });

            process.nextTick(function ()
            {
                utils.invokeCallback(cb);
            });
        } else
        {
            process.nextTick(function ()
            {
                utils.invokeCallback(cb);
            });
        }
    };

    /**
     * Kick a user offline by session id.
     *
     * @param {Number}   sid session id
     * @param {Function} cb  callback function
     *
     * @memberOf SessionService
     */
    kickBySessionId(sid : number, reason ?: string, cb ?: (err ?: Error , result ?: void)=>void)
    {
        if (typeof reason === 'function')
        {
            cb = reason;
            reason = 'kick';
        }

        var session = this.get(sid);

        if (session)
        {
            // notify client
            session.closed(reason);
            process.nextTick(function ()
            {
                utils.invokeCallback(cb);
            });
        } else
        {
            process.nextTick(function ()
            {
                utils.invokeCallback(cb);
            });
        }
    };

    /**
     * Get client remote address by session id.
     *
     * @param {Number}   sid session id
     * @return {Object} remote address of client
     *
     * @memberOf SessionService
     */
    getClientAddressBySessionId(sid : number)
    {
        var session = this.get(sid);
        if (session)
        {
            var socket = session.__socket__;
            return socket.remoteAddress;
        } else
        {
            return null;
        }
    };

    /**
     * Send message to the client by session id.
     *
     * @param {String} sid session id
     * @param {Object} msg message to send
     *
     * @memberOf SessionService
     * @api private
     */
    sendMessage(sid : number, msg : any)
    {
        var session = this.sessions[sid];

        if (!session)
        {
            logger.debug('Fail to send message for non-existing session, sid: ' + sid + ' msg: ' + msg);
            return false;
        }

        return send(this, session, msg);
    };

    /**
     * Send message to the client by user id.
     *
     * @param {String} uid userId
     * @param {Object} msg message to send
     *
     * @memberOf SessionService
     * @api private
     */
    sendMessageByUid(uid : number, msg : any)
    {
        var sessions = this.uidMap[uid];

        if (!sessions)
        {
            logger.debug('fail to send message by uid for non-existing session. uid: %j',
                uid);
            return false;
        }

        for (var i = 0, l = sessions.length; i < l; i++)
        {
            send(this, sessions[i], msg);
        }
    };

    /**
     * Iterate all the session in the session service.
     *
     * @param  {Function} cb callback function to fetch session
     * @api private
     */
    forEachSession(cb)
    {
        for (var sid in this.sessions)
        {
            cb(this.sessions[sid]);
        }
    };

    /**
     * Iterate all the binded session in the session service.
     *
     * @param  {Function} cb callback function to fetch session
     * @api private
     */
    forEachBindedSession(cb)
    {
        var i, l, sessions;
        for (var uid in this.uidMap)
        {
            sessions = this.uidMap[uid];
            for (i = 0, l = sessions.length; i < l; i++)
            {
                cb(sessions[i]);
            }
        }
    };

    /**
     * Get sessions' quantity in specified server.
     *
     */
    getSessionsCount()
    {
        return utils.size(this.sessions);
    };

    
    akick:(uid : string, reason ?: string)=>Promise<void> = utils.promisify(this.kick);
    akickBySessionId:(sid : number, reason ?: string)=>Promise<void> = utils.promisify(this.kickBySessionId);
    abind:(sid : number, uid : string)=>Promise<void> = utils.promisify(this.bind);
    aunbind:(sid : number, uid : string)=>Promise<void> = utils.promisify(this.unbind);
    aimport:(sid : number, key : string, value : any)=>Promise<void> = utils.promisify(this.import);
    aimportAll:(sid : number, settings : any)=>Promise<void> = utils.promisify(this.importAll);
}
/**
 * Send message to the client that associated with the session.
 *
 * @api private
 */
var send = function(service, session, msg) {
  session.send(msg);

  return true;
};

/**
 * Session maintains the relationship between client connection and user information.
 * There is a session associated with each client connection. And it should bind to a
 * user id after the client passes the identification.
 *
 * Session is created in frontend server and should not be accessed in handler.
 * There is a proxy class called BackendSession in backend servers and FrontendSession 
 * in frontend servers.
 */
export class Session extends EventEmitter
{
    id: number;
    frontendId: string;
    uid: string;
    settings: any;

    __socket__: any;
    private __sessionService__: SessionService;
    private __state__: number;


    constructor(sid, frontendId, socket, service)
    {

        super();
        this.id = sid;          // r
        this.frontendId = frontendId; // r
        this.uid = null;        // r
        this.settings = {};

        // private
        this.__socket__ = socket;
        this.__sessionService__ = service;
        this.__state__ = ST_INITED;
    };

    /*
     * Export current session as frontend session.
     */
    toFrontendSession()
    {
        return new FrontendSession(this);
    };

    /**
     * Bind the session with the the uid.
     *
     * @param {Number} uid User id
     * @api public
     */
    bind(uid)
    {
        this.uid = uid;
        this.emit('bind', uid);
    };

    /**
     * Unbind the session with the the uid.
     *
     * @param {Number} uid User id
     * @api private
     */
    unbind(uid)
    {
        this.uid = null;
        this.emit('unbind', uid);
    };

    /**
     * Set values (one or many) for the session.
     *
     * @param {String|Object} key session key
     * @param {Object} value session value
     * @api public
     */
    set(key, value)
    {
        if (utils.isObject(key))
        {
            for (var i in key)
            {
                this.settings[i] = key[i];
            }
        } else
        {
            this.settings[key] = value;
        }
    };

    /**
     * Remove value from the session.
     *
     * @param {String} key session key
     * @api public
     */
    remove(key)
    {
        delete this[key];
    };

    /**
     * Get value from the session.
     *
     * @param {String} key session key
     * @return {Object} value associated with session key
     * @api public
     */
    get(key)
    {
        return this.settings[key];
    };

    /**
     * Send message to the session.
     *
     * @param  {Object} msg final message sent to client
     */
    send(msg)
    {
        this.__socket__.send(msg);
    };

    /**
     * Send message to the session in batch.
     *
     * @param  {Array} msgs list of message
     */
    sendBatch(msgs)
    {
        this.__socket__.sendBatch(msgs);
    };

    /**
     * Closed callback for the session which would disconnect client in next tick.
     *
     * @api public
     */
    closed(reason)
    {
        logger.debug('session on [%s] is closed with session id: %s', this.frontendId, this.id);
        if (this.__state__ === ST_CLOSED)
        {
            return;
        }
        this.__state__ = ST_CLOSED;
        this.__sessionService__.remove(this.id);
        this.emit('closed', this.toFrontendSession(), reason);
        this.__socket__.emit('closing', reason);

        var self = this;
        // give a chance to send disconnect message to client

        process.nextTick(function ()
        {
            self.__socket__.disconnect();
        });
    };
}

/**
 * Frontend session for frontend server.
 */
export class FrontendSession extends EventEmitter
{
    id:number;
    uid:string;
    frontendId:string;
    settings: any;
    private __session__: Session;
    private __sessionService__ : SessionService;

    constructor(session)
    {
        super();
        clone(session, this, FRONTEND_SESSION_FIELDS);
        // deep copy for settings
        this.settings = dclone(session.settings);
        this.__session__ = session;
    };


    bind(uid, cb : (err ?: Error , result ?: void)=>void)
    {
        var self = this;
        this.__sessionService__.bind(this.id, uid, function (err)
        {
            if (!err)
            {
                self.uid = uid;
            }
            utils.invokeCallback(cb, err);
        });
    };

    unbind(uid, cb : (err ?: Error , result ?: void)=>void)
    {
        var self = this;
        this.__sessionService__.unbind(this.id, uid, function (err)
        {
            if (!err)
            {
                self.uid = null;
            }
            utils.invokeCallback(cb, err);
        });
    };

    set(key, value)
    {
        this.settings[key] = value;
    };

    get(key)
    {
        return this.settings[key];
    };

    push(key, cb : (err ?: Error , result ?: void)=>void)
    {
        this.__sessionService__.import(this.id, key, this.get(key), cb);
    };

    pushAll(cb : (err ?: Error , result ?: void)=>void)
    {
        this.__sessionService__.importAll(this.id, this.settings, cb);
    };

    on(event: string | symbol, listener: (...args: any[]) => void): this
    {
        this.__session__.on(event, listener);
        return super.on(event, listener);
    };


    abind = utils.promisify(this.bind);
    aunbind = utils.promisify(this.unbind);
    apush = utils.promisify(this.push);
    apushAll = utils.promisify(this.pushAll);

    /**
     * Export the key/values for serialization.
     *
     * @api private
     */
    export()
    {
        var res = {};
        clone(this, res, EXPORTED_SESSION_FIELDS);
        return res;
    };
}

var clone = function (src, dest, includes)
{
    var f;
    for (var i = 0, l = includes.length; i < l; i++)
    {
        f = includes[i];
        dest[f] = src[f];
    }
};

var dclone = function (src)
{
    var res = {};
    for (var f in src)
    {
        res[f] = src[f];
    }
    return res;
};
