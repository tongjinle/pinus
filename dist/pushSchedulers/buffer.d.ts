import { Application } from '../application';
export declare class BufferService {
    app: Application;
    flushInterval: number;
    sessions: {};
    tid: any;
    constructor(app: any, opts: any);
    start: (cb: any) => void;
    stop: (force: any, cb: any) => void;
    schedule: (reqId: any, route: any, msg: any, recvs: any, opts: any, cb: any) => void;
}
