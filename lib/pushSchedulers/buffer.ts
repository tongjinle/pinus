import * as utils from '../util/utils';
import { Application } from '../application';
var DEFAULT_FLUSH_INTERVAL = 20;

export class BufferPushScheduler
{
    app: Application;
    flushInterval: number;
    sessions = {};   // sid -> msg queue
    tid = null;

    constructor(app, opts)
    {

        opts = opts || {};
        this.app = app;
        this.flushInterval = opts.flushInterval || DEFAULT_FLUSH_INTERVAL;
    };

    async start()
    {
        this.tid = setInterval(this.flush.bind(this), this.flushInterval);
    };

    async stop()
    {
        if (this.tid)
        {
            clearInterval(this.tid);
            this.tid = null;
        }
    };

    schedule(reqId, route, msg, recvs, opts, cb)
    {
        opts = opts || {};
        if (opts.type === 'broadcast')
        {
            doBroadcast(this, msg, opts.userOptions);
        } else
        {
            doBatchPush(this, msg, recvs);
        }

        process.nextTick(function ()
        {
            utils.invokeCallback(cb);
        });
    };

    flush()
    {
        var sessionService = this.app.get('sessionService');
        var queue, session;
        for (var sid in this.sessions)
        {
            session = sessionService.get(sid);
            if (!session)
            {
                continue;
            }

            queue = this.sessions[sid];
            if (!queue || queue.length === 0)
            {
                continue;
            }

            session.sendBatch(queue);
            this.sessions[sid] = [];
        }
    };

}

var doBroadcast = function (self, msg, opts)
{
    var channelService = self.app.get('channelService');
    var sessionService = self.app.get('sessionService');

    if (opts.binded)
    {
        sessionService.forEachBindedSession(function (session)
        {
            if (channelService.broadcastFilter &&
                !channelService.broadcastFilter(session, msg, opts.filterParam))
            {
                return;
            }

            enqueue(self, session, msg);
        });
    } else
    {
        sessionService.forEachSession(function (session)
        {
            if (channelService.broadcastFilter &&
                !channelService.broadcastFilter(session, msg, opts.filterParam))
            {
                return;
            }

            enqueue(self, session, msg);
        });
    }
};

var doBatchPush = function (self, msg, recvs)
{
    var sessionService = self.app.get('sessionService');
    var session;
    for (var i = 0, l = recvs.length; i < l; i++)
    {
        session = sessionService.get(recvs[i]);
        if (session)
        {
            enqueue(self, session, msg);
        }
    }
};

var enqueue = function (self, session, msg)
{
    var queue = self.sessions[session.id];
    if (!queue)
    {
        queue = self.sessions[session.id] = [];
        session.once('closed', onClose.bind(null, self));
    }

    queue.push(msg);
};

var onClose = function (self, session)
{
    delete self.sessions[session.id];
};
