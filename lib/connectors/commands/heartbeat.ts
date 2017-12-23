import { Package } from 'pomelo-protocol';
import { getLogger } from 'pomelo-logger';
var logger = getLogger('pomelo', __filename);

/**
 * Process heartbeat request.
 *
 * @param {Object} opts option request
 *                      opts.heartbeat heartbeat interval
 */
export class HeartbeatCommand
{
    heartbeat = null;
    timeout = null;
    disconnectOnTimeout: boolean;
    timeouts = {};
    clients = {};
    constructor(opts)
    {
        opts = opts || {};
        this.disconnectOnTimeout = opts.disconnectOnTimeout;

        if (opts.heartbeat)
        {
            this.heartbeat = opts.heartbeat * 1000; // heartbeat interval
            this.timeout = opts.timeout * 1000 || this.heartbeat * 2;      // max heartbeat message timeout
            this.disconnectOnTimeout = true;
        }

    };

    handle = function (socket)
    {
        if (!this.heartbeat)
        {
            // no heartbeat setting
            return;
        }

        var self = this;

        if (!this.clients[socket.id])
        {
            // clear timers when socket disconnect or error
            this.clients[socket.id] = 1;
            socket.once('disconnect', clearTimers.bind(null, this, socket.id));
            socket.once('error', clearTimers.bind(null, this, socket.id));
        }

        // clear timeout timer
        if (self.disconnectOnTimeout)
        {
            this.clear(socket.id);
        }

        socket.sendRaw(Package.encode(Package.TYPE_HEARTBEAT));

        if (self.disconnectOnTimeout)
        {
            self.timeouts[socket.id] = setTimeout(function ()
            {
                logger.info('client %j heartbeat timeout.', socket.id);
                socket.disconnect();
            }, self.timeout);
        }
    };

    clear = function (id)
    {
        var tid = this.timeouts[id];
        if (tid)
        {
            clearTimeout(tid);
            delete this.timeouts[id];
        }
    };
}

var clearTimers = function (self, id)
{
    delete self.clients[id];
    var tid = self.timeouts[id];
    if (tid)
    {
        clearTimeout(tid);
        delete self.timeouts[id];
    }
};
