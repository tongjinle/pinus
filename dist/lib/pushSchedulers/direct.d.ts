import { Application } from '../application';
export declare class DirectService {
    app: Application;
    constructor(app: any, opts: any);
    schedule(reqId: any, route: any, msg: any, recvs: any, opts: any, cb: any): void;
}
