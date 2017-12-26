export declare class RpcLogFilter {
    name: string;
    /**
     * Before filter for rpc
     */
    before(serverId: any, msg: any, opts: any, next: any): void;
    /**
     * After filter for rpc
     */
    after(serverId: any, msg: any, opts: any, next: any): void;
}
