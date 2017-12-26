/**
 * Filter for timeout.
 * Print a warn information when request timeout.
 */
import { getLogger } from 'pinus-logger'; var logger = getLogger('pinus', __filename);
import * as  utils from '../../util/utils';

var DEFAULT_TIMEOUT = 3000;
var DEFAULT_SIZE = 500;

export class TimeoutFilter
{
    timeouts = {};
    curId = 0;
    constructor(private timeout = DEFAULT_TIMEOUT, private maxSize = DEFAULT_SIZE)
    {
    };

    before(routeRecord , msg, session, next)
    {
        var count = utils.size(this.timeouts);
        if (count > this.maxSize)
        {
            logger.warn('timeout filter is out of range, current size is %s, max size is %s', count, this.maxSize);
            next();
            return;
        }
        this.curId++;
        this.timeouts[this.curId] = setTimeout(function ()
        {
            logger.error('request %j timeout.', routeRecord.route);
        }, this.timeout);
        session.__timeout__ = this.curId;
        next();
    };

    after(err, routeRecord , msg, session, resp, next)
    {
        var timeout = this.timeouts[session.__timeout__];
        if (timeout)
        {
            clearTimeout(timeout);
            delete this.timeouts[session.__timeout__];
        }
        next(err);
    };

}