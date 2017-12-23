import { Gateway } from 'pomelo-rpc';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
/**
 * Remote component factory function
 *
 * @param {Object} app  current application context
 * @param {Object} opts construct parameters
 *                       opts.acceptorFactory {Object}: acceptorFactory.create(opts, cb)
 * @return {Object}     remote component instances
 */
export default function (app: any, opts: any): RemoteComponent;
/**
 * Remote component class
 *
 * @param {Object} app  current application context
 * @param {Object} opts construct parameters
 */
export declare class RemoteComponent implements IComponent {
    private app;
    private opts;
    constructor(app: Application, opts: any);
    name: string;
    remote: Gateway;
    /**
     * Remote component lifecycle function
     *
     * @param {Function} cb
     * @return {Void}
     */
    start(cb: any): void;
    /**
     * Remote component lifecycle function
     *
     * @param {Boolean}  force whether stop the component immediately
     * @param {Function}  cb
     * @return {Void}
     */
    stop(force: any, cb: any): void;
}
