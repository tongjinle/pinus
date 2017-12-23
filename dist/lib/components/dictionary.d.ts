import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
export declare class DictionaryComponent implements IComponent {
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
