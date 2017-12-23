"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Remote session service for frontend server.
 * Set session info for backend servers.
 */
const utils = require("../../../util/utils");
function default_1(app) {
    return new SessionRemote(app);
}
exports.default = default_1;
;
class SessionRemote {
    constructor(app) {
        this.bind = utils.promisify(function (sid, uid, cb) {
            this.app.get('sessionService').bind(sid, uid, cb);
        });
        this.unbind = utils.promisify(function (sid, uid, cb) {
            this.app.get('sessionService').unbind(sid, uid, cb);
        });
        this.push = utils.promisify(function (sid, key, value, cb) {
            this.app.get('sessionService').import(sid, key, value, cb);
        });
        this.pushAll = utils.promisify(function (sid, settings, cb) {
            this.app.get('sessionService').importAll(sid, settings, cb);
        });
        /**
         * Get session informations with session id.
         *
         * @param  {String}   sid session id binded with the session
         * @param  {Function} cb(err, sinfo)  callback funtion, sinfo would be null if the session not exist.
         */
        this.getBackendSessionBySid = utils.promisify(function (sid, cb) {
            var session = this.app.get('sessionService').get(sid);
            if (!session) {
                utils.invokeCallback(cb);
                return;
            }
            utils.invokeCallback(cb, null, session.toFrontendSession().export());
        });
        /**
         * Get all the session informations with the specified user id.
         *
         * @param  {String}   uid user id binded with the session
         * @param  {Function} cb(err, sinfo)  callback funtion, sinfo would be null if the session does not exist.
         */
        this.getBackendSessionsByUid = utils.promisify(function (uid, cb) {
            var sessions = this.app.get('sessionService').getByUid(uid);
            if (!sessions) {
                utils.invokeCallback(cb);
                return;
            }
            var res = [];
            for (var i = 0, l = sessions.length; i < l; i++) {
                res.push(sessions[i].toFrontendSession().export());
            }
            utils.invokeCallback(cb, null, res);
        });
        /**
         * Kick a session by session id.
         *
         * @param  {Number}   sid session id
         * @param  {String}   reason  kick reason
         * @param  {Function} cb  callback function
         */
        this.kickBySid = utils.promisify(function (sid, reason, cb) {
            this.app.get('sessionService').kickBySessionId(sid, reason, cb);
        });
        /**
         * Kick sessions by user id.
         *
         * @param  {Number|String}   uid user id
         * @param  {String}          reason     kick reason
         * @param  {Function} cb     callback function
         */
        this.kickByUid = utils.promisify(function (uid, reason, cb) {
            this.app.get('sessionService').kick(uid, reason, cb);
        });
        this.app = app;
    }
    ;
}
exports.SessionRemote = SessionRemote;
//# sourceMappingURL=sessionRemote.js.map