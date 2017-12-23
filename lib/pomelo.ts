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
import {SessionComponent } from './components/session';


import { RpcToobusyFilter } from './filters/rpc/toobusy';
import { RpcLogFilter } from './filters/rpc/rpcLog';
import { ToobusyFilter } from './filters/handler/toobusy';
import { TimeFilter } from './filters/handler/time';
import { SerialFilter } from './filters/handler/serial';
import { TimeoutFilter } from './filters/handler/timeout';
var Package = require('../../package');

import {default as events} from './util/events';
import { BackendSessionComponent } from './components/backendSession';
import { ChannelComponent } from './components/channel';
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
        get backendSession() { return BackendSessionComponent; }
        get channel() { return ChannelComponent; }
        get connection() { return ConnectionComponent; }
        get connector() { return ConnectorComponent; }
        get dictionary() { return DictionaryComponent; }
        get master() { return MasterComponent; }
        get monitor() { return MonitorComponent; }
        get protobuf() { return ProtobufComponent; }
        get proxy() { return ProxyComponent; }
        get pushScheduler() { return PushSchedulerComponent; }
        get remote() { return RemoteComponent; }
        get server() { return ServerComponent; }
        get session() { return SessionComponent; }
    };

    /**
     * auto loaded filters
     */
    filters = new class
    {
        get serial() { return SerialFilter; }
        get time() { return TimeFilter; }
        get timeout() { return TimeoutFilter; }
        get toobusy() { return ToobusyFilter; }
    };

    /**
     * auto loaded rpc filters
     */
    rpcFilters = new class
    {
        get rpcLog() { return RpcLogFilter; }
        get toobusy() { return RpcToobusyFilter; }
    };


    /**
     * connectors
     */
    connectors = new class
    {
        get sioconnector() { return SIOConnector; }
        get hybridconnector() { return HybridConnector; }
        get udpconnector() { return UDPConnector; }
        get mqttconnector() { return MQTTConnector; }
    };

    /**
     * pushSchedulers
     */
    pushSchedulers = new class
    {
        get direct() { return DirectService; }
        get buffer() { return BufferService; }
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
    createApp(opts ?: any)
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

export var pomelo = new Pomelo();