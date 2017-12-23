export declare var timeout: number;
/**
 * Add tasks into task group. Create the task group if it dose not exist.
 *
 * @param {String}   key       task key
 * @param {Function} fn        task callback
 * @param {Function} ontimeout task timeout callback
 * @param {Number}   timeout   timeout for task
 */
export declare function addTask(key: any, fn: any, ontimeout: any, timeoutMs: any): any;
/**
 * Destroy task group
 *
 * @param  {String} key   task key
 * @param  {Boolean} force whether close task group directly
 */
export declare function closeQueue(key: any, force: any): void;
