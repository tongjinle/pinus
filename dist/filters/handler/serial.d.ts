export default function (timeout: any): SerialFilter;
export declare class SerialFilter {
    private timeout;
    constructor(timeout: number);
    /**
     * request serialization after filter
     */
    before: (msg: any, session: any, next: any) => void;
    /**
     * request serialization after filter
     */
    after: (err: any, msg: any, session: any, resp: any, next: any) => void;
}
