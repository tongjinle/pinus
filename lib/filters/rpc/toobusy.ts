/**
 * Filter for rpc log.
 * Reject rpc request when toobusy
 */
import { getLogger } from 'pinus-logger';
var rpcLogger = getLogger('rpc-log', __filename);
var toobusy = null;

var DEFAULT_MAXLAG = 70;

export default function (maxLag)
{
    return new RpcToobusyFilter(maxLag || DEFAULT_MAXLAG);
};

export class RpcToobusyFilter
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

    name = 'toobusy';

    /**
     * Before filter for rpc
     */
    before(serverId, msg, opts, next)
    {
        opts = opts || {};
        if (!!toobusy && toobusy())
        {
            rpcLogger.warn('Server too busy for rpc request, serverId:' + serverId + ' msg: ' + msg);
            var err = new Error('Backend server ' + serverId + ' is too busy now!');
            (err as any).code = 500;
            next(err);
        } else
        {
            next();
        }
    };
}