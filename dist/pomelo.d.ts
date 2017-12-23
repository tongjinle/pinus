/*!
 * Pomelo
 * Copyright(c) 2012 xiechengchao <xiecc@163.com>
 * MIT Licensed
 */
import { Application } from './application';
import { BackendSession } from './common/service/backendSessionService';
import { HybridConnector } from './connectors/hybridconnector';
import { UDPConnector } from './connectors/udpconnector';
import { MQTTConnector } from './connectors/mqttconnector';
import { SIOConnector } from './connectors/sioconnector';
import { DirectService } from './pushSchedulers/direct';
import { BufferService } from './pushSchedulers/buffer';
import { ChannelService } from './common/service/channelService';
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
    events: any;
    /**
     * auto loaded components
     */
    components: {
        readonly backendSession: BackendSession;
        readonly channel: ChannelService;
        readonly connection: ConnectionComponent;
        readonly connector: ConnectorComponent;
        readonly dictionary: DictionaryComponent;
        readonly master: MasterComponent;
        readonly monitor: MonitorComponent;
        readonly protobuf: ProtobufComponent;
        readonly proxy: ProxyComponent;
        readonly pushScheduler: PushSchedulerComponent;
        readonly remote: RemoteComponent;
        readonly server: ServerComponent;
        readonly session: SessionComponent;
    };
    /**
     * auto loaded filters
     */
    filters: {
        readonly serial: SerialFilter;
        readonly time: TimeFilter;
        readonly timeout: TimeoutFilter;
        readonly toobusy: ToobusyFilter;
    };
    /**
     * auto loaded rpc filters
     */
    rpcFilters: {
        readonly rpcLog: RpcLogFilter;
        readonly toobusy: RpcToobusyFilter;
    };
    /**
     * connectors
     */
    connectors: {
        readonly sioconnector: SIOConnector;
        readonly hybridconnector: HybridConnector;
        readonly udpconnector: UDPConnector;
        readonly mqttconnector: MQTTConnector;
    };
    /**
     * pushSchedulers
     */
    pushSchedulers: {
        readonly direct: DirectService;
        readonly buffer: BufferService;
    };
    constructor();
    /**
     * Create an pomelo application.
     *
     * @return {Application}
     * @memberOf Pomelo
     * @api public
     */
    createApp(opts: any): Application;
    /**
     * Get application
     */
    readonly app: Application;
}
export declare var pomelo: Pomelo;
