/// <reference types="node" />
import { EventEmitter } from 'events';
import { Application } from '../application';
export declare class Watchdog extends EventEmitter {
    private app;
    private service;
    isStarted: boolean;
    servers: {};
    _listeners: {};
    count: number;
    constructor(app: Application, service: any);
    addServer: (server: any) => void;
    removeServer: (id: any) => void;
    reconnectServer: (server: any) => void;
    subscribe: (id: any) => void;
    unsubscribe: (id: any) => void;
    query: () => any;
    record: (id: any) => void;
    notifyById: (id: any, msg: any) => void;
    notify: (msg: any) => void;
}
