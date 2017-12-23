/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * Socket class that wraps socket and websocket to provide unified interface for up level.
 */
export declare class MQTTSocket extends EventEmitter {
    id: number;
    socket: any;
    remoteAddress: {
        ip: string;
        port: number;
    };
    adaptor: any;
    state: number;
    constructor(id: any, socket: any, adaptor: any);
    send: (msg: any) => void;
    sendBatch: (msgs: any) => void;
    disconnect: () => void;
}
