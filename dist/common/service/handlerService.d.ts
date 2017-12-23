import { Application } from '../../application';
/**
 * Handler service.
 * Dispatch request to the relactive handler.
 *
 * @param {Object} app      current application context
 */
export declare class HandlerService {
    app: Application;
    handlerMap: {};
    enableForwardLog: boolean;
    constructor(app: any, opts: any);
    name: string;
    /**
     * Handler the request.
     */
    handle(routeRecord: any, msg: any, session: any, cb: any): void;
    /**
     * Get handler instance by routeRecord.
     *
     * @param  {Object} handlers    handler map
     * @param  {Object} routeRecord route record parsed from route string
     * @return {Object}             handler instance if any matchs or null for match fail
     */
    getHandler(routeRecord: any): any;
}
