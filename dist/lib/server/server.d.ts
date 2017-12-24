/// <reference types="node" />
import { HandlerService } from '../common/service/handlerService';
import { Application } from '../application';
import { EventEmitter } from 'events';
/**
 * Server factory function.
 *
 * @param {Object} app  current application context
 * @return {Object} erver instance
 */
export declare function create(app: any, opts: any): Server;
export declare class Server extends EventEmitter {
    app: Application;
    opts: any;
    globalFilterService: any;
    filterService: any;
    handlerService: HandlerService;
    cronHandlers: any;
    crons: any[];
    jobs: {};
    state: number;
    constructor(app: any, opts: any);
    /**
     * Server lifecycle callback
     */
    start(): void;
    afterStart(): void;
    /**
     * Stop server
     */
    stop(): void;
    /**
     * Global handler.
     *
     * @param  {Object} msg request message
     * @param  {Object} session session object
     * @param  {Callback} callback function
     */
    globalHandle(msg: any, session: any, cb: any): void;
    /**
     * Handle request
     */
    handle(msg: any, session: any, cb: any): void;
    /**
     * Add crons at runtime.
     *
     * @param {Array} crons would be added in application
     */
    addCrons(crons: any): void;
    /**
     * Remove crons at runtime.
     *
     * @param {Array} crons would be removed in application
     */
    removeCrons(crons: any): void;
}
