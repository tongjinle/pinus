"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for master.
 */
const master_1 = require("../master/master");
/**
 * Component factory function
 *
 * @param  {Object} app  current application context
 * @return {Object}      component instances
 */
function default_1(app, opts) {
    return new MasterComponent(app, opts);
}
exports.default = default_1;
;
/**
* Master component class
*
* @param {Object} app  current application context
*/
class MasterComponent {
    constructor(app, opts) {
        this.name = '__master__';
        /**
         * Component lifecycle function
         *
         * @param  {Function} cb
         * @return {Void}
         */
        this.start = function (cb) {
            this.master.start(cb);
        };
        /**
         * Component lifecycle function
         *
         * @param  {Boolean}   force whether stop the component immediately
         * @param  {Function}  cb
         * @return {Void}
         */
        this.stop = function (force, cb) {
            this.master.stop(cb);
        };
        this.master = new master_1.MasterServer(app, opts);
    }
    ;
}
exports.MasterComponent = MasterComponent;
//# sourceMappingURL=master.js.map