import { Application } from '../application';
import { ConsoleService } from 'pomelo-admin';
export declare class MasterServer {
    app: Application;
    masterInfo: any;
    registered: {};
    modules: any[];
    closeWatcher: any;
    masterConsole: ConsoleService;
    constructor(app: any, opts: any);
    start: (cb: any) => void;
    stop: (cb: any) => void;
}
