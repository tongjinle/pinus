export declare class RpcToobusyFilter {
    constructor(maxLag?: number);
    name: string;
    /**
     * Before filter for rpc
     */
    before(serverId: any, msg: any, opts: any, next: any): void;
}
