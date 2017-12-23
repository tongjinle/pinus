/// <reference types="node" />
import * as tls from 'tls';
import { EventEmitter } from 'events';
import { HandshakeCommand } from './commands/handshake';
import { HeartbeatCommand } from './commands/heartbeat';
import { ConnectorComponent } from '../components/connector';
import { DictionaryComponent } from '../components/dictionary';
import { ProtobufComponent } from '../components/protobuf';
import { Component } from '../interfaces/Component';
/**
 * Connector that manager low level connection and protocol bewteen server and client.
 * Develper can provide their own connector to switch the low level prototol, such as tcp or probuf.
 */
export declare class HybridConnector extends EventEmitter {
    opts: any;
    port: number;
    host: string;
    useDict: boolean;
    useProtobuf: boolean;
    handshake: HandshakeCommand;
    heartbeat: HeartbeatCommand;
    distinctHost: string;
    ssl: tls.TlsOptions;
    switcher: any;
    connector: ConnectorComponent;
    dictionary: DictionaryComponent;
    protobuf: ProtobufComponent;
    decodeIO_protobuf: Component;
    listeningServer: any;
    constructor(port: any, host: any, opts: any);
    /**
     * Start connector to listen the specified port
     */
    start(cb: any): void;
    stop(force: any, cb: any): void;
    decode: (msg: any) => any;
    encode: (reqId: any, route: any, msg: any) => any;
}
