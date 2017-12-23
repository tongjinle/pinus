export default function (): TimeFilter;
export declare class TimeFilter {
    before: (msg: any, session: any, next: any) => void;
    after: (err: any, msg: any, session: any, resp: any, next: any) => void;
}
