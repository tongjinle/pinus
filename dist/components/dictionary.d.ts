import { Application } from '../application';
import { Component } from '../interfaces/Component';
export default function (app: any, opts: any): DictionaryComponent;
export declare class DictionaryComponent implements Component {
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
