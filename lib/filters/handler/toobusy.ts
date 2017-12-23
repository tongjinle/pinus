/**
 * Filter for toobusy.
 * if the process is toobusy, just skip the new request
 */
import { getLogger } from 'pomelo-logger';

var conLogger = getLogger('con-log', __filename);
var toobusy = null;
var DEFAULT_MAXLAG = 70;


export default function (maxLag)
{
    return new ToobusyFilter(maxLag || DEFAULT_MAXLAG);
};

export class ToobusyFilter
{
    constructor(maxLag)
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

    before(msg, session, next)
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