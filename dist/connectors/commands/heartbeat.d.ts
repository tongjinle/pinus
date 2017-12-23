/**
 * Process heartbeat request.
 *
 * @param {Object} opts option request
 *                      opts.heartbeat heartbeat interval
 */
export declare class HeartbeatCommand {
    heartbeat: any;
    timeout: any;
    disconnectOnTimeout: boolean;
    timeouts: {};
    clients: {};
    constructor(opts: any);
    handle: (socket: any) => void;
    clear: (id: any) => void;
}
