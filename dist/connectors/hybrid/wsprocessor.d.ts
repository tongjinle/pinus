/// <reference types="node" />
import { Server as HttpServer } from 'http';
import { EventEmitter } from 'events';
import { Server as WebSocketServer } from 'ws';
/**
 * websocket protocol processor
 */
export declare class WSProcessor extends EventEmitter {
    httpServer: HttpServer;
    wsServer: WebSocketServer;
    state: number;
    constructor();
    add: (socket: any, data: any) => void;
    close: () => void;
}
