/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * Socket class that wraps socket and websocket to provide unified interface for up level.
 */
export declare class HybridSocket extends EventEmitter {
    id: string;
    socket: any;
    remoteAddress: {
        ip: string;
        port: number;
    };
    state: number;
    constructor(id: any, socket: any);
    /**
     * Send raw byte data.
     *
     * @api private
     */
    sendRaw(msg: any): void;
    /**
     * Send byte data package to client.
     *
     * @param  {Buffer} msg byte data
     */
    send(msg: any): void;
    /**
     * Send byte data packages to client in batch.
     *
     * @param  {Buffer} msgs byte data
     */
    sendBatch(msgs: any): void;
    /**
     * Send message to client no matter whether handshake.
     *
     * @api private
     */
    sendForce(msg: any): void;
    /**
     * Response handshake request
     *
     * @api private
     */
    handshakeResponse(resp: any): void;
    /**
     * Close the connection.
     *
     * @api private
     */
    disconnect(): void;
}
