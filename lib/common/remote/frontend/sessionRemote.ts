/**
 * Remote session service for frontend server.
 * Set session info for backend servers.
 */
import * as utils from '../../../util/utils';
import { Application } from '../../../application';

export default function(app) {
  return new SessionRemote(app);
};


export class SessionRemote
{
    app: Application;
    constructor(app)
    {
        this.app = app;
    };
    bind = utils.promisify( (sid, uid, cb : (err : Error | null , result ?: void)=>void)=>
    {
        this.app.sessionService.bind(sid, uid, cb);
    });

    unbind = utils.promisify( (sid, uid, cb : (err : Error | null , result ?: void)=>void)=>
    {
        this.app.get('sessionService').unbind(sid, uid, cb);
    });

    push = utils.promisify( (sid, key, value, cb : (err : Error | null , result ?: void)=>void)=>
    {
        this.app.get('sessionService').import(sid, key, value, cb);
    });

    pushAll = utils.promisify( (sid, settings, cb : (err : Error | null , result ?: void)=>void)=>
    {
        this.app.get('sessionService').importAll(sid, settings, cb);
    });

    /**
     * Get session informations with session id.
     *
     * @param  {String}   sid session id binded with the session
     * @param  {Function} cb(err, sinfo)  callback funtion, sinfo would be null if the session not exist.
     */
    getBackendSessionBySid = utils.promisify((sid, cb : (err : Error | null , result ?: any)=>void)=>
    {
        var session = this.app.get('sessionService').get(sid);
        if (!session)
        {
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
    getBackendSessionsByUid = utils.promisify( (uid, cb : (err : Error | null , result ?: any)=>void)=>
    {
        var sessions = this.app.get('sessionService').getByUid(uid);
        if (!sessions)
        {
            utils.invokeCallback(cb);
            return;
        }

        var res = [];
        for (var i = 0, l = sessions.length; i < l; i++)
        {
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
    kickBySid = utils.promisify( (sid, reason, cb : (err : Error | null , result ?: void)=>void)=>
    {
        this.app.get('sessionService').kickBySessionId(sid, reason, cb);
    });

    /**
     * Kick sessions by user id.
     *
     * @param  {Number|String}   uid user id
     * @param  {String}          reason     kick reason
     * @param  {Function} cb     callback function
     */
    kickByUid = utils.promisify( (uid, reason, cb : (err : Error | null , result ?: void)=>void)=>
    {
        this.app.get('sessionService').kick(uid, reason, cb);
    });
}