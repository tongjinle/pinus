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
import { DirectPushScheduler } from './pushSchedulers/direct';
import { BufferPushScheduler } from './pushSchedulers/buffer';
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
        backendSession: typeof BackendSessionComponent;
        channel: typeof ChannelComponent;
        connection: typeof ConnectionComponent;
        connector: typeof ConnectorComponent;
        dictionary: typeof DictionaryComponent;
        master: typeof MasterComponent;
        monitor: typeof MonitorComponent;
        protobuf: typeof ProtobufComponent;
        proxy: typeof ProxyComponent;
        pushScheduler: typeof PushSchedulerComponent;
        remote: typeof RemoteComponent;
        server: typeof ServerComponent;
        session: typeof SessionComponent;
    };
    /**
     * auto loaded filters
     */
    filters: {
        serial: typeof SerialFilter;
        time: typeof TimeFilter;
        timeout: typeof TimeoutFilter;
        toobusy: typeof ToobusyFilter;
    };
    /**
     * auto loaded rpc filters
     */
    rpcFilters: {
        rpcLog: typeof RpcLogFilter;
        toobusy: typeof RpcToobusyFilter;
    };
    /**
     * connectors
     */
    connectors: {
        sioconnector: typeof SIOConnector;
        hybridconnector: typeof HybridConnector;
        udpconnector: typeof UDPConnector;
        mqttconnector: typeof MQTTConnector;
    };
    /**
     * pushSchedulers
     */
    pushSchedulers: {
        direct: typeof DirectPushScheduler;
        buffer: typeof BufferPushScheduler;
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
