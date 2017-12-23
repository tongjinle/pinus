/*!
 * Pomelo
 * Copyright(c) 2012 xiechengchao <xiecc@163.com>
 * MIT Licensed
 */
import { Application } from './application';
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
    components: {};
    /**
     * auto loaded filters
     */
    filters: {};
    /**
     * auto loaded rpc filters
     */
    rpcFilters: {};
    /**
     * connectors
     */
    connectors: {
        readonly sioconnector: any;
        readonly hybridconnector: any;
        readonly udpconnector: any;
        readonly mqttconnector: any;
    };
    /**
     * pushSchedulers
     */
    pushSchedulers: {
        readonly direct: any;
        readonly buffer: any;
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
