import { Watchdog } from '../master/watchdog';
import { Application } from '../application';
export default function (opts: any, consoleService: any): MasterWatcherModule;
export declare var moduleId: string;
export declare class MasterWatcherModule {
    app: Application;
    service: any;
    id: string;
    watchdog: Watchdog;
    constructor(opts: any, consoleService: any);
    onServerAdd(record: any): void;
    onServerReconnect(record: any): void;
    onServerLeave(id: any, type: any): void;
    start(cb: any): void;
    masterHandler(agent: any, msg: any, cb: any): void;
}
