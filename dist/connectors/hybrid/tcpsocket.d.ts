/// <reference types="node" />
import { Stream } from 'stream';
/**
 * Tcp socket wrapper with package compositing.
 * Collect the package from socket and emit a completed package with 'data' event.
 * Uniform with ws.WebSocket interfaces.
 *
 * @param {Object} socket origin socket from node.js net module
 * @param {Object} opts   options parameter.
 *                        opts.headSize size of package head
 *                        opts.headHandler(headBuffer) handler for package head. caculate and return body size from head data.
 */
export declare class TcpSocket extends Stream {
    readable: boolean;
    writeable: boolean;
    _socket: any;
    headSize: number;
    closeMethod: string;
    headBuffer: Buffer;
    headHandler: Function;
    headOffset: number;
    packageOffset: number;
    packageSize: number;
    packageBuffer: Buffer;
    state: number;
    constructor(socket: any, opts: any);
    send(msg: any, encode: any, cb: any): void;
    close(): void;
}
