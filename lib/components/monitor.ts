/**
 * Component for monitor.
 * Load and start monitor client.
 */
import { Monitor } from '../monitor/monitor';
import { IComponent } from '../interfaces/Component';



export class MonitorComponent implements IComponent
{
    monitor: Monitor;
    constructor(app, opts)
    {
        this.monitor = new Monitor(app, opts);
    };

    name = '__monitor__';
    start(cb)
    {
        this.monitor.start(cb);
    };

    stop(force, cb)
    {
        this.monitor.stop(cb);
    };

    reconnect(masterInfo)
    {
        this.monitor.reconnect(masterInfo);
    };
}