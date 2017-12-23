/// <reference types="node" />
import * as EventEmitter from 'events';
export declare class UdpSocket extends EventEmitter {
    id: string;
    socket: any;
    peer: any;
    host: string;
    port: number;
    remoteAddress: {
        ip: string;
        port: number;
    };
    state: number;
    constructor(id: any, socket: any, peer: any);
    /**
     * Send byte data package to client.
     *
     * @param  {Buffer} msg byte data
     */
    send: (msg: any) => void;
    sendRaw: (msg: any) => void;
    sendForce: (msg: any) => void;
    handshakeResponse: (resp: any) => void;
    sendBatch: (msgs: any) => void;
    disconnect: () => void;
}
