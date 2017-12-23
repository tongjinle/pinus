/*!
 * Pomelo
 * Copyright(c) 2012 xiechengchao <xiecc@163.com>
 * MIT Licensed
 */
import { Application } from './application';
import { HybridConnector } from './connectors/hybridconnector';
import { UDPConnector } from './connectors/udpconnector';
import { MQTTConnector } from './connectors/mqttconnector';
import { SIOConnector } from './connectors/sioconnector';
import { DirectService } from './pushSchedulers/direct';
import { BufferService } from './pushSchedulers/buffer';
import { ConnectionComponent } from './components/connection';
import { ConnectorComponent } from './components/connector';
import { DictionaryComponent } from './components/dictionary';
import { MasterComponent } from './components/master';
import { MonitorComponent } from './components/monitor';
import { ProtobufComponent } from './components/protobuf';
import { ProxyComponent } from './components/proxy';
import { PushSchedulerComponent } from './components/pushScheduler';
import { RemoteComponent } from './components/remote';
import { ServerComponent } from './components/server';
import { SessionComponent } from './components/session';
import { RpcToobusyFilter } from './filters/rpc/toobusy';
import { RpcLogFilter } from './filters/rpc/rpcLog';
import { ToobusyFilter } from './filters/handler/toobusy';
import { TimeFilter } from './filters/handler/time';
import { SerialFilter } from './filters/handler/serial';
import { TimeoutFilter } from './filters/handler/timeout';
import { BackendSessionComponent } from './components/backendSession';
import { ChannelComponent } from './components/channel';
/**
 * Expose `createApplication()`.
 *
 * @module
 */
export declare class Pomelo {
    private _app;
    /**
     * Framework version.
     */
    version: any;
    /**
     * Event definitions that would be emitted by app.event
     */
    events: {
        ADD_SERVERS: string;
        REMOVE_SERVERS: string;
        REPLACE_SERVERS: string;
        BIND_SESSION: string;
        UNBIND_SESSION: string;
        CLOSE_SESSION: string;
        ADD_CRONS: string;
        REMOVE_CRONS: string;
        START_SERVER: string;
        START_ALL: string;
    };
    /**
     * auto loaded components
     */
    components: {
        readonly backendSession: typeof BackendSessionComponent;
        readonly channel: typeof ChannelComponent;
        readonly connection: typeof ConnectionComponent;
        readonly connector: typeof ConnectorComponent;
        readonly dictionary: typeof DictionaryComponent;
        readonly master: typeof MasterComponent;
        readonly monitor: typeof MonitorComponent;
        readonly protobuf: typeof ProtobufComponent;
        readonly proxy: typeof ProxyComponent;
        readonly pushScheduler: typeof PushSchedulerComponent;
        readonly remote: typeof RemoteComponent;
        readonly server: typeof ServerComponent;
        readonly session: typeof SessionComponent;
    };
    /**
     * auto loaded filters
     */
    filters: {
        readonly serial: typeof SerialFilter;
        readonly time: typeof TimeFilter;
        readonly timeout: typeof TimeoutFilter;
        readonly toobusy: typeof ToobusyFilter;
    };
    /**
     * auto loaded rpc filters
     */
    rpcFilters: {
        readonly rpcLog: typeof RpcLogFilter;
        readonly toobusy: typeof RpcToobusyFilter;
    };
    /**
     * connectors
     */
    connectors: {
        readonly sioconnector: typeof SIOConnector;
        readonly hybridconnector: typeof HybridConnector;
        readonly udpconnector: typeof UDPConnector;
        readonly mqttconnector: typeof MQTTConnector;
    };
    /**
     * pushSchedulers
     */
    pushSchedulers: {
        readonly direct: typeof DirectService;
        readonly buffer: typeof BufferService;
    };
    constructor();
    /**
     * Create an pomelo application.
     *
     * @return {Application}
     * @memberOf Pomelo
     * @api public
     */
    createApp(opts?: any): Application;
    /**
     * Get application
     */
    readonly app: Application;
}
export declare var pomelo: Pomelo;
