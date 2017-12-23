/*!
 * Pomelo
 * Copyright(c) 2012 xiechengchao <xiecc@163.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
import * as fs from 'fs';
import * as path from 'path';
import { Application } from './application';
import { isFunction } from 'util';
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
var Package = require('../package');

import {default as events} from './util/events';
/**
 * Expose `createApplication()`.
 *
 * @module
 */

export class Pomelo
{
    private _app: Application;
    /**
     * Framework version.
     */

    version = Package.version;

    /**
     * Event definitions that would be emitted by app.event
     */
    events = events;

    /**
     * auto loaded components
     */
    components = new class
    {
        get backendSession() { return load<BackendSession>('./components/backendSession'); }
        get channel() { return load<ChannelService>('./components/channel'); }
        get connection() { return load<ConnectionComponent>('./components/connection'); }
        get connector() { return load<ConnectorComponent>('./components/connector'); }
        get dictionary() { return load<DictionaryComponent>('./components/dictionary'); }
        get master() { return load<MasterComponent>('./components/master'); }
        get monitor() { return load<MonitorComponent>('./components/monitor'); }
        get protobuf() { return load<ProtobufComponent>('./components/protobuf'); }
        get proxy() { return load<ProxyComponent>('./components/proxy'); }
        get pushScheduler() { return load<PushSchedulerComponent>('./components/pushScheduler'); }
        get remote() { return load<RemoteComponent>('./components/remote'); }
        get server() { return load<ServerComponent>('./components/server'); }
        get session() { return load<SessionComponent>('./components/session'); }
    };

    /**
     * auto loaded filters
     */
    filters = new class
    {
        get serial() { return load<SerialFilter>('./filters/handler/serial'); }
        get time() { return load<TimeFilter>('./filters/handler/time'); }
        get timeout() { return load<TimeoutFilter>('./filters/handler/serial'); }
        get toobusy() { return load<ToobusyFilter>('./filters/handler/toobusy'); }
    };

    /**
     * auto loaded rpc filters
     */
    rpcFilters = new class
    {
        get rpcLog() { return load<RpcLogFilter>('./filters/handler/rpcLog'); }
        get toobusy() { return load<RpcToobusyFilter>('./filters/handler/toobusy'); }
    };


    /**
     * connectors
     */
    connectors = new class
    {
        get sioconnector() { return load<SIOConnector>('./connectors/sioconnector'); }
        get hybridconnector() { return load<HybridConnector>('./connectors/hybridconnector'); }
        get udpconnector() { return load<UDPConnector>('./connectors/udpconnector'); }
        get mqttconnector() { return load<MQTTConnector>('./connectors/mqttconnector'); }
    };

    /**
     * pushSchedulers
     */
    pushSchedulers = new class
    {
        get direct() { return load<DirectService>('./pushSchedulers/direct'); }
        get buffer() { return load<BufferService>('./pushSchedulers/buffer'); }
    };

    constructor()
    {
    }

    /**
     * Create an pomelo application.
     *
     * @return {Application}
     * @memberOf Pomelo
     * @api public
     */
    createApp(opts)
    {
        var app = new Application();
        app.init(opts);
        this._app = app;
        return app;
    };

    /**
     * Get application
     */
    get app()
    {
        return this._app;
    }
}

function load<T>(path : string) : T
 {
     var m = require(path);
     if(!isFunction(m.default))
     {
         throw new Error(path + ' is not a component, component must export default function');
     }
    return m.default();
}

export var pomelo = new Pomelo();