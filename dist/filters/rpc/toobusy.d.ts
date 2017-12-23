export default function (maxLag: any): RpcToobusyFilter;
export declare class RpcToobusyFilter {
    constructor(maxLag: any);
    name: string;
    /**
     * Before filter for rpc
     */
    before(serverId: any, msg: any, opts: any, next: any): void;
}
