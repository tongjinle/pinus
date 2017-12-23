/// <reference types="node" />
import { EventEmitter } from 'events';
import { WSProcessor } from './wsprocessor';
import { TCPProcessor } from './tcpprocessor';
import { Server } from '../../server/server';
/**
 * Switcher for tcp and websocket protocol
 *
 * @param {Object} server tcp server instance from node.js net module
 */
export declare class HybridSwitcher extends EventEmitter {
    server: Server;
    wsprocessor: WSProcessor;
    tcpprocessor: TCPProcessor;
    id: number;
    timeout: number;
    setNoDelay: boolean;
    state: number;
    constructor(server: any, opts: any);
    newSocket: (socket: any) => void;
    close: () => void;
}
