import { getLogger } from 'pinus-logger'; var logger = getLogger('pinus', __filename);
import * as utils from '../util/utils';
import * as Constants from '../util/constants';
import * as countDownLatch from '../util/countDownLatch';
import { EventEmitter } from 'events';
import * as util from 'util';
import { Application } from '../application';

export class Watchdog extends EventEmitter
{

    isStarted = false;
    servers = {};
    _listeners = {};
    count: number;
    constructor(private app: Application, private service: any)
    {
        super();

        this.count = utils.size(app.getServersFromConfig());

    };


    addServer(server)
    {
        if (!server)
        {
            return;
        }
        this.servers[server.id] = server;
        this.notify({ action: 'addServer', server: server });
    };

    removeServer(id)
    {
        if (!id)
        {
            return;
        }
        this.unsubscribe(id);
        delete this.servers[id];
        this.notify({ action: 'removeServer', id: id });
    };

    reconnectServer(server)
    {
        var self = this;
        if (!server)
        {
            return;
        }
        if (!this.servers[server.id])
        {
            this.servers[server.id] = server;
        }
        //replace server in reconnect server
        this.notifyById(server.id, { action: 'replaceServer', servers: self.servers });
        // notify other server to add server
        this.notify({ action: 'addServer', server: server });
        // add server in listener
        this.subscribe(server.id);
    };

    subscribe(id)
    {
        this._listeners[id] = 1;
    };

    unsubscribe(id)
    {
        delete this._listeners[id];
    };

    query()
    {
        return this.servers;
    };

    record(id)
    {
        if (!this.isStarted && --this.count < 0)
        {
            var usedTime = Date.now() - this.app.startTime;
            logger.info('all servers startup in %s ms', usedTime);
            this.notify({ action: 'startOver' });
            this.isStarted = true;
        }
    };

    notifyById(id, msg)
    {
        this.service.agent.request(id, Constants.KEYWORDS.MONITOR_WATCHER, msg, function (signal)
        {
            if (signal !== Constants.SIGNAL.OK)
            {
                logger.error('master watchdog fail to notify to monitor, id: %s, msg: %j', id, msg);
            } else
            {
                logger.debug('master watchdog notify to monitor success, id: %s, msg: %j', id, msg);
            }
        });
    };

    notify(msg)
    {
        var _listeners = this._listeners;
        var success = true;
        var fails = [];
        var timeouts = [];
        var requests = {};
        var count = utils.size(_listeners);
        if (count === 0)
        {
            logger.warn('master watchdog _listeners is none, msg: %j', msg);
            return;
        }
        var latch = countDownLatch.createCountDownLatch(count, { timeout: Constants.TIME.TIME_WAIT_COUNTDOWN }, function (isTimeout)
        {
            if (!!isTimeout)
            {
                for (var key in requests)
                {
                    if (!requests[key])
                    {
                        timeouts.push(key);
                    }
                }
                logger.error('master watchdog request timeout message: %j, timeouts: %j, fails: %j', msg, timeouts, fails);
            }
            if (!success)
            {
                logger.error('master watchdog request fail message: %j, fails: %j', msg, fails);
            }
        });

        var moduleRequest = function (self, id)
        {
            return (function ()
            {
                self.service.agent.request(id, Constants.KEYWORDS.MONITOR_WATCHER, msg, function (signal)
                {
                    if (signal !== Constants.SIGNAL.OK)
                    {
                        fails.push(id);
                        success = false;
                    }
                    requests[id] = 1;
                    latch.done();
                });
            })();
        };

        for (var id in _listeners)
        {
            requests[id] = 0;
            moduleRequest(this, id);
        }
    };
}