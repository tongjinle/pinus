"use strict";
/*!
 * Pomelo
 * Copyright(c) 2012 xiechengchao <xiecc@163.com>
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
const hybridconnector_1 = require("./connectors/hybridconnector");
const udpconnector_1 = require("./connectors/udpconnector");
const mqttconnector_1 = require("./connectors/mqttconnector");
const sioconnector_1 = require("./connectors/sioconnector");
const direct_1 = require("./pushSchedulers/direct");
const buffer_1 = require("./pushSchedulers/buffer");
const connection_1 = require("./components/connection");
const connector_1 = require("./components/connector");
const dictionary_1 = require("./components/dictionary");
const master_1 = require("./components/master");
const monitor_1 = require("./components/monitor");
const protobuf_1 = require("./components/protobuf");
const proxy_1 = require("./components/proxy");
const pushScheduler_1 = require("./components/pushScheduler");
const remote_1 = require("./components/remote");
const server_1 = require("./components/server");
const session_1 = require("./components/session");
const toobusy_1 = require("./filters/rpc/toobusy");
const rpcLog_1 = require("./filters/rpc/rpcLog");
const toobusy_2 = require("./filters/handler/toobusy");
const time_1 = require("./filters/handler/time");
const serial_1 = require("./filters/handler/serial");
const timeout_1 = require("./filters/handler/timeout");
var Package = require('../../package');
const events_1 = require("./util/events");
const backendSession_1 = require("./components/backendSession");
const channel_1 = require("./components/channel");
/**
 * Expose `createApplication()`.
 *
 * @module
 */
class Pomelo {
    constructor() {
        /**
         * Framework version.
         */
        this.version = Package.version;
        /**
         * Event definitions that would be emitted by app.event
         */
        this.events = events_1.default;
        /**
         * auto loaded components
         */
        this.components = new class {
            get backendSession() { return backendSession_1.BackendSessionComponent; }
            get channel() { return channel_1.ChannelComponent; }
            get connection() { return connection_1.ConnectionComponent; }
            get connector() { return connector_1.ConnectorComponent; }
            get dictionary() { return dictionary_1.DictionaryComponent; }
            get master() { return master_1.MasterComponent; }
            get monitor() { return monitor_1.MonitorComponent; }
            get protobuf() { return protobuf_1.ProtobufComponent; }
            get proxy() { return proxy_1.ProxyComponent; }
            get pushScheduler() { return pushScheduler_1.PushSchedulerComponent; }
            get remote() { return remote_1.RemoteComponent; }
            get server() { return server_1.ServerComponent; }
            get session() { return session_1.SessionComponent; }
        };
        /**
         * auto loaded filters
         */
        this.filters = new class {
            get serial() { return serial_1.SerialFilter; }
            get time() { return time_1.TimeFilter; }
            get timeout() { return timeout_1.TimeoutFilter; }
            get toobusy() { return toobusy_2.ToobusyFilter; }
        };
        /**
         * auto loaded rpc filters
         */
        this.rpcFilters = new class {
            get rpcLog() { return rpcLog_1.RpcLogFilter; }
            get toobusy() { return toobusy_1.RpcToobusyFilter; }
        };
        /**
         * connectors
         */
        this.connectors = new class {
            get sioconnector() { return sioconnector_1.SIOConnector; }
            get hybridconnector() { return hybridconnector_1.HybridConnector; }
            get udpconnector() { return udpconnector_1.UDPConnector; }
            get mqttconnector() { return mqttconnector_1.MQTTConnector; }
        };
        /**
         * pushSchedulers
         */
        this.pushSchedulers = new class {
            get direct() { return direct_1.DirectService; }
            get buffer() { return buffer_1.BufferService; }
        };
    }
    /**
     * Create an pomelo application.
     *
     * @return {Application}
     * @memberOf Pomelo
     * @api public
     */
    createApp(opts) {
        var app = new application_1.Application();
        app.init(opts);
        this._app = app;
        return app;
    }
    ;
    /**
     * Get application
     */
    get app() {
        return this._app;
    }
}
exports.Pomelo = Pomelo;
exports.pomelo = new Pomelo();
//# sourceMappingURL=pomelo.js.map