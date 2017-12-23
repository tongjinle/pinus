/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * Socket class that wraps socket.io socket to provide unified interface for up level.
 */
export declare class SioSocket extends EventEmitter {
    id: number;
    socket: any;
    remoteAddress: {
        ip: string;
        port: number;
    };
    state: number;
    constructor(id: any, socket: any);
    send(msg: any): void;
    disconnect(): void;
    sendBatch(msgs: any): void;
}
