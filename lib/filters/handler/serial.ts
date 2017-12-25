/**
 * Filter to keep request sequence.
 */
import { getLogger } from 'pinus-logger'; var logger = getLogger('pinus', __filename);
import * as taskManager from '../../common/manager/taskManager';

export default function(timeout) {
  return new SerialFilter(timeout);
};

export class SerialFilter
{
    constructor(private timeout : number)
    {
    };

    /**
     * request serialization after filter
     */
    before(msg, session, next)
    {
        taskManager.addTask(session.id, function (task)
        {
            session.__serialTask__ = task;
            next();
        }, function ()
        {
            logger.error('[serial filter] msg timeout, msg:' + JSON.stringify(msg));
        }, this.timeout);
    };

    /**
     * request serialization after filter
     */
    after(err, msg, session, resp, next)
    {
        var task = session.__serialTask__;
        if (task)
        {
            if (!task.done() && !err)
            {
                err = new Error('task time out. msg:' + JSON.stringify(msg));
            }
        }
        next(err);
    };
}