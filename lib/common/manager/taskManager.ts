import * as sequeue from 'seq-queue';

var queues = {};

export var timeout = 3000;

/**
 * Add tasks into task group. Create the task group if it dose not exist.
 *
 * @param {String}   key       task key
 * @param {Function} fn        task callback
 * @param {Function} ontimeout task timeout callback
 * @param {Number}   timeout   timeout for task
 */
export function addTask(key, fn, ontimeout, timeoutMs)
{
    var queue = queues[key];
    if (!queue)
    {
        queue = sequeue.createQueue(timeout);
        queues[key] = queue;
    }

    return queue.push(fn, ontimeout, timeoutMs);
};

/**
 * Destroy task group
 *
 * @param  {String} key   task key
 * @param  {Boolean} force whether close task group directly
 */
export function closeQueue(key, force)
{
    if (!queues[key])
    {
        // ignore illeagle key
        return;
    }

    queues[key].close(force);
    delete queues[key];
};
