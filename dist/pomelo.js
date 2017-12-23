"use strict";
/*!
 * Pomelo
 * Copyright(c) 2012 xiechengchao <xiecc@163.com>
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
const util_1 = require("util");
var Package = require('../package');
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
        this.events = require('./util/events');
        /**
         * auto loaded components
         */
        this.components = new class {
            get backendSession() { return load('./components/backendSession'); }
            get channel() { return load('./components/channel'); }
            get connection() { return load('./components/connection'); }
            get connector() { return load('./components/connector'); }
            get dictionary() { return load('./components/dictionary'); }
            get master() { return load('./components/master'); }
            get monitor() { return load('./components/monitor'); }
            get protobuf() { return load('./components/protobuf'); }
            get proxy() { return load('./components/proxy'); }
            get pushScheduler() { return load('./components/pushScheduler'); }
            get remote() { return load('./components/remote'); }
            get server() { return load('./components/server'); }
            get session() { return load('./components/session'); }
        };
        /**
         * auto loaded filters
         */
        this.filters = new class {
            get serial() { return load('./filters/handler/serial'); }
            get time() { return load('./filters/handler/time'); }
            get timeout() { return load('./filters/handler/serial'); }
            get toobusy() { return load('./filters/handler/toobusy'); }
        };
        /**
         * auto loaded rpc filters
         */
        this.rpcFilters = new class {
            get rpcLog() { return load('./filters/handler/rpcLog'); }
            get toobusy() { return load('./filters/handler/toobusy'); }
        };
        /**
         * connectors
         */
        this.connectors = new class {
            get sioconnector() { return load('./connectors/sioconnector'); }
            get hybridconnector() { return load('./connectors/hybridconnector'); }
            get udpconnector() { return load('./connectors/udpconnector'); }
            get mqttconnector() { return load('./connectors/mqttconnector'); }
        };
        /**
         * pushSchedulers
         */
        this.pushSchedulers = new class {
            get direct() { return load('./pushSchedulers/direct'); }
            get buffer() { return load('./pushSchedulers/buffer'); }
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
function load(path) {
    var m = require(path);
    if (!util_1.isFunction(m.default)) {
        throw new Error(path + ' is not a component, component must export default function');
    }
    return m.default();
}
exports.pomelo = new Pomelo();
//# sourceMappingURL=pomelo.js.map