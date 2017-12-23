import { Application } from '../application';
export default function (app: any, opts: any): DictionaryComponent;
export declare class DictionaryComponent {
    app: Application;
    dict: {};
    abbrs: {};
    userDicPath: any;
    version: string;
    name: string;
    constructor(app: any, opts: any);
    start(cb: any): void;
    getDict(): {};
    getAbbrs(): {};
    getVersion(): string;
}
