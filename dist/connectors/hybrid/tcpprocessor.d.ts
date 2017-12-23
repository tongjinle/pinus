/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * websocket protocol processor
 */
export declare class TCPProcessor extends EventEmitter {
    closeMethod: Function;
    state: number;
    constructor(closeMethod: any);
    add: (socket: any, data: any) => void;
    close: () => void;
}
