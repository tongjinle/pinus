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
var Package = require('../package');

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
    events = require('./util/events');

    /**
     * auto loaded components
     */
    components = {};

    /**
     * auto loaded filters
     */
    filters = {};

    /**
     * auto loaded rpc filters
     */
    rpcFilters = {};


    /**
     * connectors
     */
    connectors = new class
    {
        get sioconnector() { return load('./connectors/sioconnector'); }
        get hybridconnector() { return load('./connectors/hybridconnector'); }
        get udpconnector() { return load('./connectors/udpconnector'); }
        get mqttconnector() { return load('./connectors/mqttconnector'); }
    };

    /**
     * pushSchedulers
     */
    pushSchedulers = new class
    {
        get direct() { return load('./pushSchedulers/direct'); }
        get buffer() { return load('./pushSchedulers/buffer'); }
    };

    constructor()
    {

        /**
         * Auto-load bundled components with getters.
         */
        fs.readdirSync(__dirname + '/components').forEach(function (filename)
        {
            if (!/\.js$/.test(filename))
            {
                return;
            }
            var name = path.basename(filename, '.js');
            var _load = load.bind(null, './components/', name);

            this.components.__defineGetter__(name, _load);
            this.__defineGetter__(name, _load);
        });

        fs.readdirSync(__dirname + '/filters/handler').forEach(function (filename)
        {
            if (!/\.js$/.test(filename))
            {
                return;
            }
            var name = path.basename(filename, '.js');
            var _load = load.bind(null, './filters/handler/', name);

            this.filters.__defineGetter__(name, _load);
            this.__defineGetter__(name, _load);
        });

        fs.readdirSync(__dirname + '/filters/rpc').forEach(function (filename)
        {
            if (!/\.js$/.test(filename))
            {
                return;
            }
            var name = path.basename(filename, '.js');
            var _load = load.bind(null, './filters/rpc/', name);

            this.rpcFilters.__defineGetter__(name, _load);
        });

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

function load(path, name ?: string) {
  if (name) {
    return require(path + name);
  }
  return require(path);
}

export var pomelo = new Pomelo();