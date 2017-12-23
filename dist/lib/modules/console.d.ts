import { Application } from '../application';
import { IModule } from 'pomelo-admin';
export declare class ConsoleModule implements IModule {
    app: Application;
    starter: any;
    static moduleId: string;
    constructor(opts: any);
    monitorHandler(agent: any, msg: any, cb: any): void;
    clientHandler(agent: any, msg: any, cb: any): void;
}
