/**
 * Scheduler component to schedule message sending.
 */

import {DirectPushScheduler as DefaultScheduler} from '../pushSchedulers/direct';
import { getLogger } from 'pinus-logger';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
import { IPushScheduler } from '../interfaces/IPushScheduler';
import { MultiPushScheduler } from '../pushSchedulers/multi';
var logger = getLogger('pinus', __filename);



export class PushSchedulerComponent implements IComponent
{
    scheduler : IPushScheduler;
    constructor(private app : Application, opts)
    {
        opts = opts || {};
        this.scheduler = getScheduler(this, app, opts);
    };

    name = '__pushScheduler__';

    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    afterStart(cb)
    {
        this.scheduler.start().then(cb);
    };

    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    stop(force, cb)
    {
        this.scheduler.stop().then(cb);
    };

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
    schedule(reqId, route, msg, recvs, opts, cb)
    {
        this.scheduler.schedule(reqId, route, msg, recvs, opts, cb);     
    };
}
var getScheduler = function (pushSchedulerComp, app, opts)
{
    var scheduler = opts.scheduler || DefaultScheduler;
    if (typeof scheduler === 'function')
    {
        return new scheduler(app, opts);
    }

    if (Array.isArray(scheduler))
    {
        return new MultiPushScheduler(app , opts);
    }

    return scheduler;
};
