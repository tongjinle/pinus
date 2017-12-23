"use strict";
/*!
 * Pomelo
 * Copyright(c) 2012 xiechengchao <xiecc@163.com>
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
const fs = require("fs");
const path = require("path");
const application_1 = require("./application");
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
        this.components = {};
        /**
         * auto loaded filters
         */
        this.filters = {};
        /**
         * auto loaded rpc filters
         */
        this.rpcFilters = {};
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
        /**
         * Create an pomelo application.
         *
         * @return {Application}
         * @memberOf Pomelo
         * @api public
         */
        this.createApp = function (opts) {
            var app = new application_1.Application();
            app.init(opts);
            this._app = app;
            return app;
        };
        /**
         * Auto-load bundled components with getters.
         */
        fs.readdirSync(__dirname + '/components').forEach(function (filename) {
            if (!/\.js$/.test(filename)) {
                return;
            }
            var name = path.basename(filename, '.js');
            var _load = load.bind(null, './components/', name);
            this.components.__defineGetter__(name, _load);
            this.__defineGetter__(name, _load);
        });
        fs.readdirSync(__dirname + '/filters/handler').forEach(function (filename) {
            if (!/\.js$/.test(filename)) {
                return;
            }
            var name = path.basename(filename, '.js');
            var _load = load.bind(null, './filters/handler/', name);
            this.filters.__defineGetter__(name, _load);
            this.__defineGetter__(name, _load);
        });
        fs.readdirSync(__dirname + '/filters/rpc').forEach(function (filename) {
            if (!/\.js$/.test(filename)) {
                return;
            }
            var name = path.basename(filename, '.js');
            var _load = load.bind(null, './filters/rpc/', name);
            this.rpcFilters.__defineGetter__(name, _load);
        });
    }
    /**
     * Get application
     */
    get app() {
        return this._app;
    }
}
exports.Pomelo = Pomelo;
function load(path, name) {
    if (name) {
        return require(path + name);
    }
    return require(path);
}
exports.pomelo = new Pomelo();
//# sourceMappingURL=pomelo.js.map