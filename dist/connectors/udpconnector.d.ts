/// <reference types="node" />
import { HandshakeCommand } from './commands/handshake';
import { HeartbeatCommand } from './commands/heartbeat';
import { EventEmitter } from 'events';
export declare class UDPConnector extends EventEmitter {
    opts: any;
    type: string;
    handshake: HandshakeCommand;
    heartbeat: HeartbeatCommand;
    clients: {
        [key: string]: any;
    };
    host: string;
    port: number;
    constructor(port: any, host: any, opts: any);
    start: (cb: any) => void;
    decode: (msg: any) => any;
    encode: (reqId: any, route: any, msg: any) => any;
    stop: (force: any, cb: any) => void;
}
