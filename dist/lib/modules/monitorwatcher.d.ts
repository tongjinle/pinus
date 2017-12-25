import { Application } from '../application';
import { IModule } from 'pinus-admin';
export declare class MonitorWatcherModule implements IModule {
    app: Application;
    service: any;
    id: string;
    static moduleId: string;
    constructor(opts: any, consoleService: any);
    start(cb: any): void;
    monitorHandler(agent: any, msg: any, cb: any): void;
}
