/**
 * Component for master.
 */
import { MasterServer } from '../master/master';

/**
 * Component factory function
 *
 * @param  {Object} app  current application context
 * @return {Object}      component instances
 */
export default function (app, opts) {
    return new MasterComponent(app, opts);
};

/**
* Master component class
*
* @param {Object} app  current application context
*/
export class MasterComponent
{
    name = '__master__';
    master: MasterServer;
    constructor(app, opts)
    {
        this.master = new MasterServer(app, opts);
    };
    
    /**
     * Component lifecycle function
     *
     * @param  {Function} cb
     * @return {Void}
     */
    start = function (cb)
    {
        this.master.start(cb);
    };

    /**
     * Component lifecycle function
     *
     * @param  {Boolean}   force whether stop the component immediately
     * @param  {Function}  cb
     * @return {Void}
     */
    stop = function (force, cb)
    {
        this.master.stop(cb);
    };

}