/**
 * Count down to zero or timeout and invoke cb finally.
 */
export declare class CountDownLatch {
    count: number;
    cb: Function;
    timerId: any;
    constructor(count: any, opts: any, cb: any);
    /**
     * Call when a task finish to count down.
     *
     * @api public
     */
    done: () => void;
}
/**
 * Create a count down latch
 *
 * @param {Integer} count
 * @param {Object} opts, opts.timeout indicates timeout, optional param
 * @param {Function} cb, cb(isTimeout)
 *
 * @api public
 */
export declare function createCountDownLatch(count: any, opts: any, cb?: Function): CountDownLatch;
