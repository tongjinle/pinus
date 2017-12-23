import { Application } from '../application';
export declare var moduleId: string;
export declare class MonitorWatcherModule {
    app: Application;
    service: any;
    id: string;
    constructor(opts: any, consoleService: any);
    start: (cb: any) => void;
    monitorHandler: (agent: any, msg: any, cb: any) => void;
}
