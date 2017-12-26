/**
 * Filter for toobusy.
 * if the process is toobusy, just skip the new request
 */
import { getLogger } from 'pinus-logger';

var conLogger = getLogger('con-log', __filename);
var toobusy = null;
var DEFAULT_MAXLAG = 70;


export class ToobusyFilter
{
    constructor(maxLag = DEFAULT_MAXLAG)
    {
        try
        {
            toobusy = require('toobusy');
        } catch (e)
        {
        }
        if (!!toobusy)
        {
            toobusy.maxLag(maxLag);
        }
    };

    before(routeRecord , msg, session, next)
    {
        if (!!toobusy && toobusy())
        {
            conLogger.warn('[toobusy] reject request msg: ' + msg);
            var err = new Error('Server toobusy!');
            (err as any).code = 500;
            next(err);
        } else
        {
            next();
        }
    };
}