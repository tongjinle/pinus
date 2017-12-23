/**
 * Component for monitor.
 * Load and start monitor client.
 */
import { Monitor } from '../monitor/monitor';



/**
 * Component factory function
 *
 * @param  {Object} app  current application context
 * @return {Object}      component instances
 */
export default function (app, opts)
{
    return new MonitorComponent(app, opts);
};

export class MonitorComponent
{
    monitor: Monitor;
    constructor(app, opts)
    {
        this.monitor = new Monitor(app, opts);
    };

    name = '__monitor__';
    start = function (cb)
    {
        this.monitor.start(cb);
    };

    stop = function (force, cb)
    {
        this.monitor.stop(cb);
    };

    reconnect = function (masterInfo)
    {
        this.monitor.reconnect(masterInfo);
    };
}