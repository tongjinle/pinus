import { Application } from '../application';
import { IPushScheduler } from '../interfaces/IPushScheduler';
export declare class DirectPushScheduler implements IPushScheduler {
    app: Application;
    constructor(app: any, opts: any);
    schedule(reqId: any, route: any, msg: any, recvs: any, opts: any, cb: any): void;
}
