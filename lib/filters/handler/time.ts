/**
 * Filter for statistics.
 * Record used time for each request.
 */
import { getLogger } from 'pinus-logger';
var conLogger = getLogger('con-log', __filename);
import * as utils from '../../util/utils';

export default function() {
  return new TimeFilter();
};

export class TimeFilter
{
    before(msg, session, next)
    {
        session.__startTime__ = Date.now();
        next();
    };

    after(err, msg, session, resp, next)
    {
        var start = session.__startTime__;
        if (typeof start === 'number')
        {
            var timeUsed = Date.now() - start;
            var log = {
                route: msg.__route__,
                args: msg,
                time: utils.format(new Date(start)),
                timeUsed: timeUsed
            };
            conLogger.info(JSON.stringify(log));
        }
        next(err);
    };
}