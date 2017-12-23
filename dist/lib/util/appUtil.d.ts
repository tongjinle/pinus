import { Application } from '../application';
/**
 * Initialize application configuration.
 */
export declare function defaultConfiguration(app: Application): void;
/**
 * Start servers by type.
 */
export declare function startByType(app: Application, cb: any): void;
/**
 * Load default components for application.
 */
export declare function loadDefaultComponents(app: Application): void;
/**
 * Stop components.
 *
 * @param  {Array}  comps component list
 * @param  {Number}   index current component index
 * @param  {Boolean}  force whether stop component immediately
 * @param  {Function} cb
 */
export declare function stopComps(comps: any, index: any, force: any, cb: any): void;
/**
 * Apply command to loaded components.
 * This method would invoke the component {method} in series.
 * Any component {method} return err, it would return err directly.
 *
 * @param {Array} comps loaded component list
 * @param {String} method component lifecycle method name, such as: start, stop
 * @param {Function} cb
 */
export declare function optComponents(comps: any, method: any, cb: any): void;
