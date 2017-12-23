"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
const utils = require("../../util/utils");
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
class SessionService {
    constructor(opts) {
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
        this.create = function (sid, frontendId, socket) {
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
        this.bind = function (sid, uid, cb) {
            var session = this.sessions[sid];
            if (!session) {
                process.nextTick(function () {
                    cb(new Error('session does not exist, sid: ' + sid));
                });
                return;
            }
            if (session.uid) {
                if (session.uid === uid) {
                    // already bound with the same uid
                    cb();
                    return;
                }
                // already bound with other uid
                process.nextTick(function () {
                    cb(new Error('session has already bound with ' + session.uid));
                });
                return;
            }
            var sessions = this.uidMap[uid];
            if (!!this.singleSession && !!sessions) {
                process.nextTick(function () {
                    cb(new Error('singleSession is enabled, and session has already bound with uid: ' + uid));
                });
                return;
            }
            if (!sessions) {
                sessions = this.uidMap[uid] = [];
            }
            for (var i = 0, l = sessions.length; i < l; i++) {
                // session has binded with the uid
                if (sessions[i].id === session.id) {
                    process.nextTick(cb);
                    return;
                }
            }
            sessions.push(session);
            session.bind(uid);
            if (cb) {
                process.nextTick(cb);
            }
        };
        /**
         * Unbind a session with the user id.
         *
         * @memberOf SessionService
         * @api private
         */
        this.unbind = function (sid, uid, cb) {
            var session = this.sessions[sid];
            if (!session) {
                process.nextTick(function () {
                    cb(new Error('session does not exist, sid: ' + sid));
                });
                return;
            }
            if (!session.uid || session.uid !== uid) {
                process.nextTick(function () {
                    cb(new Error('session has not bind with ' + session.uid));
                });
                return;
            }
            var sessions = this.uidMap[uid], sess;
            if (sessions) {
                for (var i = 0, l = sessions.length; i < l; i++) {
                    sess = sessions[i];
                    if (sess.id === sid) {
                        sessions.splice(i, 1);
                        break;
                    }
                }
                if (sessions.length === 0) {
                    delete this.uidMap[uid];
                }
            }
            session.unbind(uid);
            if (cb) {
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
        this.get = function (sid) {
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
        this.getByUid = function (uid) {
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
        this.remove = function (sid) {
            var session = this.sessions[sid];
            if (session) {
                var uid = session.uid;
                delete this.sessions[session.id];
                var sessions = this.uidMap[uid];
                if (!sessions) {
                    return;
                }
                for (var i = 0, l = sessions.length; i < l; i++) {
                    if (sessions[i].id === sid) {
                        sessions.splice(i, 1);
                        if (sessions.length === 0) {
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
        this.import = function (sid, key, value, cb) {
            var session = this.sessions[sid];
            if (!session) {
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
        this.importAll = function (sid, settings, cb) {
            var session = this.sessions[sid];
            if (!session) {
                utils.invokeCallback(cb, new Error('session does not exist, sid: ' + sid));
                return;
            }
            for (var f in settings) {
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
        this.kick = function (uid, reason, cb) {
            // compatible for old kick(uid, cb);
            if (typeof reason === 'function') {
                cb = reason;
                reason = 'kick';
            }
            var sessions = this.getByUid(uid);
            if (sessions) {
                // notify client
                var sids = [];
                var self = this;
                sessions.forEach(function (session) {
                    sids.push(session.id);
                });
                sids.forEach(function (sid) {
                    self.sessions[sid].closed(reason);
                });
                process.nextTick(function () {
                    utils.invokeCallback(cb);
                });
            }
            else {
                process.nextTick(function () {
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
        this.kickBySessionId = function (sid, reason, cb) {
            if (typeof reason === 'function') {
                cb = reason;
                reason = 'kick';
            }
            var session = this.get(sid);
            if (session) {
                // notify client
                session.closed(reason);
                process.nextTick(function () {
                    utils.invokeCallback(cb);
                });
            }
            else {
                process.nextTick(function () {
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
        this.getClientAddressBySessionId = function (sid) {
            var session = this.get(sid);
            if (session) {
                var socket = session.__socket__;
                return socket.remoteAddress;
            }
            else {
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
        this.sendMessage = function (sid, msg) {
            var session = this.sessions[sid];
            if (!session) {
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
        this.sendMessageByUid = function (uid, msg) {
            var sessions = this.uidMap[uid];
            if (!sessions) {
                logger.debug('fail to send message by uid for non-existing session. uid: %j', uid);
                return false;
            }
            for (var i = 0, l = sessions.length; i < l; i++) {
                send(this, sessions[i], msg);
            }
        };
        /**
         * Iterate all the session in the session service.
         *
         * @param  {Function} cb callback function to fetch session
         * @api private
         */
        this.forEachSession = function (cb) {
            for (var sid in this.sessions) {
                cb(this.sessions[sid]);
            }
        };
        /**
         * Iterate all the binded session in the session service.
         *
         * @param  {Function} cb callback function to fetch session
         * @api private
         */
        this.forEachBindedSession = function (cb) {
            var i, l, sessions;
            for (var uid in this.uidMap) {
                sessions = this.uidMap[uid];
                for (i = 0, l = sessions.length; i < l; i++) {
                    cb(sessions[i]);
                }
            }
        };
        /**
         * Get sessions' quantity in specified server.
         *
         */
        this.getSessionsCount = function () {
            return utils.size(this.sessions);
        };
        this.akick = utils.promisify(this.kick.bind(this));
        this.akickBySessionId = utils.promisify(this.kickBySessionId.bind(this));
        opts = opts || {};
        this.singleSession = opts.singleSession;
        this.sessions = {}; // sid -> session
        this.uidMap = {}; // uid -> sessions
    }
    ;
}
exports.SessionService = SessionService;
/**
 * Send message to the client that associated with the session.
 *
 * @api private
 */
var send = function (service, session, msg) {
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
class Session extends events_1.EventEmitter {
    constructor(sid, frontendId, socket, service) {
        super();
        /*
         * Export current session as frontend session.
         */
        this.toFrontendSession = function () {
            return new FrontendSession(this);
        };
        /**
         * Bind the session with the the uid.
         *
         * @param {Number} uid User id
         * @api public
         */
        this.bind = function (uid) {
            this.uid = uid;
            this.emit('bind', uid);
        };
        /**
         * Unbind the session with the the uid.
         *
         * @param {Number} uid User id
         * @api private
         */
        this.unbind = function (uid) {
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
        this.set = function (key, value) {
            if (utils.isObject(key)) {
                for (var i in key) {
                    this.settings[i] = key[i];
                }
            }
            else {
                this.settings[key] = value;
            }
        };
        /**
         * Remove value from the session.
         *
         * @param {String} key session key
         * @api public
         */
        this.remove = function (key) {
            delete this[key];
        };
        /**
         * Get value from the session.
         *
         * @param {String} key session key
         * @return {Object} value associated with session key
         * @api public
         */
        this.get = function (key) {
            return this.settings[key];
        };
        /**
         * Send message to the session.
         *
         * @param  {Object} msg final message sent to client
         */
        this.send = function (msg) {
            this.__socket__.send(msg);
        };
        /**
         * Send message to the session in batch.
         *
         * @param  {Array} msgs list of message
         */
        this.sendBatch = function (msgs) {
            this.__socket__.sendBatch(msgs);
        };
        /**
         * Closed callback for the session which would disconnect client in next tick.
         *
         * @api public
         */
        this.closed = function (reason) {
            logger.debug('session on [%s] is closed with session id: %s', this.frontendId, this.id);
            if (this.__state__ === ST_CLOSED) {
                return;
            }
            this.__state__ = ST_CLOSED;
            this.__sessionService__.remove(this.id);
            this.emit('closed', this.toFrontendSession(), reason);
            this.__socket__.emit('closing', reason);
            var self = this;
            // give a chance to send disconnect message to client
            process.nextTick(function () {
                self.__socket__.disconnect();
            });
        };
        this.id = sid; // r
        this.frontendId = frontendId; // r
        this.uid = null; // r
        this.settings = {};
        // private
        this.__socket__ = socket;
        this.__sessionService__ = service;
        this.__state__ = ST_INITED;
    }
    ;
}
exports.Session = Session;
/**
 * Frontend session for frontend server.
 */
class FrontendSession extends events_1.EventEmitter {
    constructor(session) {
        super();
        this.bind = function (uid, cb) {
            var self = this;
            this.__sessionService__.bind(this.id, uid, function (err) {
                if (!err) {
                    self.uid = uid;
                }
                utils.invokeCallback(cb, err);
            });
        };
        this.unbind = function (uid, cb) {
            var self = this;
            this.__sessionService__.unbind(this.id, uid, function (err) {
                if (!err) {
                    self.uid = null;
                }
                utils.invokeCallback(cb, err);
            });
        };
        this.set = function (key, value) {
            this.settings[key] = value;
        };
        this.get = function (key) {
            return this.settings[key];
        };
        this.push = function (key, cb) {
            this.__sessionService__.import(this.id, key, this.get(key), cb);
        };
        this.pushAll = function (cb) {
            this.__sessionService__.importAll(this.id, this.settings, cb);
        };
        this.abind = utils.promisify(this.bind.bind(this));
        this.aunbind = utils.promisify(this.unbind.bind(this));
        this.apush = utils.promisify(this.push.bind(this));
        this.apushAll = utils.promisify(this.pushAll.bind(this));
        /**
         * Export the key/values for serialization.
         *
         * @api private
         */
        this.export = function () {
            var res = {};
            clone(this, res, EXPORTED_SESSION_FIELDS);
            return res;
        };
        clone(session, this, FRONTEND_SESSION_FIELDS);
        // deep copy for settings
        this.settings = dclone(session.settings);
        this.__session__ = session;
    }
    ;
    on(event, listener) {
        this.__session__.on(event, listener);
        return super.on(event, listener);
    }
    ;
}
exports.FrontendSession = FrontendSession;
var clone = function (src, dest, includes) {
    var f;
    for (var i = 0, l = includes.length; i < l; i++) {
        f = includes[i];
        dest[f] = src[f];
    }
};
var dclone = function (src) {
    var res = {};
    for (var f in src) {
        res[f] = src[f];
    }
    return res;
};
//# sourceMappingURL=sessionService.js.map