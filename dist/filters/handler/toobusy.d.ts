export default function (maxLag: any): ToobusyFilter;
export declare class ToobusyFilter {
    constructor(maxLag: any);
    before(msg: any, session: any, next: any): void;
}
