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
export default function (app: any, opts: any): MonitorComponent;
export declare class MonitorComponent {
    monitor: Monitor;
    constructor(app: any, opts: any);
    name: string;
    start(cb: any): void;
    stop(force: any, cb: any): void;
    reconnect(masterInfo: any): void;
}
