/**
 * Component for master.
 */
import { MasterServer } from '../master/master';
import { IComponent } from '../interfaces/Component';
/**
 * Component factory function
 *
 * @param  {Object} app  current application context
 * @return {Object}      component instances
 */
export default function (app: any, opts: any): MasterComponent;
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
