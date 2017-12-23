/**
 * Component for monitor.
 * Load and start monitor client.
 */
import { Monitor } from '../monitor/monitor';
import { IComponent } from '../interfaces/Component';
export declare class MonitorComponent implements IComponent {
    monitor: Monitor;
    constructor(app: any, opts: any);
    name: string;
    start(cb: any): void;
    stop(force: any, cb: any): void;
    reconnect(masterInfo: any): void;
}
