import { Application } from '../application';
export declare class BufferPushScheduler {
    app: Application;
    flushInterval: number;
    sessions: {};
    tid: any;
    constructor(app: any, opts: any);
    start(): Promise<void>;
    stop(): Promise<void>;
    schedule(reqId: any, route: any, msg: any, recvs: any, opts: any, cb: any): void;
    flush(): void;
}
