/**
 * Filter for rpc log.
 * Record used time for remote process call.
 */
import { getLogger } from 'pomelo-logger';
var rpcLogger = getLogger('rpc-log', __filename);

import * as utils from '../../util/utils';

export default function ()
{
    return new RpcLogFilter();
};

export class RpcLogFilter
{
    name = 'rpcLog';

    /**
     * Before filter for rpc
     */

    before(serverId, msg, opts, next)
    {
        opts = opts || {};
        opts.__start_time__ = Date.now();
        next();
    };

    /**
     * After filter for rpc
     */
    after(serverId, msg, opts, next)
    {
        if (!!opts && !!opts.__start_time__)
        {
            var start = opts.__start_time__;
            var end = Date.now();
            var timeUsed = end - start;
            var log = {
                route: msg.service,
                args: msg.args,
                time: utils.format(new Date(start)),
                timeUsed: timeUsed
            };
            rpcLogger.info(JSON.stringify(log));
        }
        next();
    };
}