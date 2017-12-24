import { Application } from '../application';
import { IPushScheduler } from '../interfaces/IPushScheduler';
export declare class DirectPushScheduler implements IPushScheduler {
    start(): Promise<void>;
    stop(): Promise<void>;
    app: Application;
    constructor(app: any, opts: any);
    schedule(reqId: any, route: any, msg: any, recvs: any, opts: any, cb: any): void;
}
