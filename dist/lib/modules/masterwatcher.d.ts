import { Watchdog } from '../master/watchdog';
import { Application } from '../application';
import { IModule } from 'pomelo-admin';
export declare class MasterWatcherModule implements IModule {
    app: Application;
    service: any;
    id: string;
    watchdog: Watchdog;
    static moduleId: string;
    constructor(opts: any, consoleService: any);
    onServerAdd(record: any): void;
    onServerReconnect(record: any): void;
    onServerLeave(id: any, type: any): void;
    start(cb: any): void;
    masterHandler(agent: any, msg: any, cb: any): void;
}
