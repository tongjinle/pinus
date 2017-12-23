import { Application } from '../application';
export default function (opts: any): ConsoleModule;
export declare var moduleId: string;
export declare class ConsoleModule {
    app: Application;
    starter: any;
    constructor(opts: any);
    monitorHandler(agent: any, msg: any, cb: any): void;
    clientHandler(agent: any, msg: any, cb: any): void;
}
