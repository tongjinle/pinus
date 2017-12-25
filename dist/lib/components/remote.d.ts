import { Gateway } from 'pinus-rpc';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
/**
 * Remote component class
 *
 * @param {Object} app  current application context
 * @param {Object} opts construct parameters
 */
export declare class RemoteComponent implements IComponent {
    private app;
    opts: any;
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
