export default function (maxLag: any): ToobusyFilter;
export declare class ToobusyFilter {
    constructor(maxLag: any);
    name: string;
    /**
     * Before filter for rpc
     */
    before: (serverId: any, msg: any, opts: any, next: any) => void;
}
