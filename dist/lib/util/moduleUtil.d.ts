import { Application } from '../application';
import { ConsoleService } from 'pomelo-admin';
/**
 * Load admin modules
 */
export declare function loadModules(self: {
    app: Application;
    modules: Array<any>;
}, consoleService: ConsoleService): void;
export declare function startModules(modules: any, cb: any): void;
/**
 * Append the default system admin modules
 */
export declare function registerDefaultModules(isMaster: any, app: Application, closeWatcher: any): void;
