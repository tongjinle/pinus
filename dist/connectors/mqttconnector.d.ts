/// <reference types="node" />
import { EventEmitter } from 'events';
import { MqttAdaptor } from './mqtt/mqttadaptor';
/**
 * Connector that manager low level connection and protocol bewteen server and client.
 * Develper can provide their own connector to switch the low level prototol, such as tcp or probuf.
 */
export declare class MQTTConnector extends EventEmitter {
    port: number;
    host: string;
    opts: any;
    adaptor: MqttAdaptor;
    mqttServer: any;
    constructor(port: any, host: any, opts: any);
    /**
     * Start connector to listen the specified port
     */
    start(cb: any): void;
    stop(): void;
    encode(reqId: any, route: any, msgBody: any): Buffer | {
        id: any;
        body: any;
    };
    close(): void;
}
