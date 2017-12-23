import { Application } from '../application';
import { ConsoleService } from 'pomelo-admin';
export declare class Monitor {
    app: Application;
    serverInfo: any;
    masterInfo: any;
    modules: any[];
    closeWatcher: any;
    monitorConsole: ConsoleService;
    constructor(app: any, opts: any);
    start: (cb: any) => void;
    startConsole: (cb: any) => void;
    stop: (cb: any) => void;
    reconnect: (masterInfo: any) => void;
}
