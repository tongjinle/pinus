/**
 * Component for master.
 */
import { MasterServer } from '../master/master';
import { IComponent } from '../interfaces/Component';
/**
* Master component class
*
* @param {Object} app  current application context
*/
export declare class MasterComponent implements IComponent {
    name: string;
    master: MasterServer;
    constructor(app: any, opts: any);
    /**
     * Component lifecycle function
     *
     * @param  {Function} cb
     * @return {Void}
     */
    start(cb: any): void;
    /**
     * Component lifecycle function
     *
     * @param  {Boolean}   force whether stop the component immediately
     * @param  {Function}  cb
     * @return {Void}
     */
    stop(force: any, cb: any): void;
}
