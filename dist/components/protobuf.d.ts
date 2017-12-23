import { Protobuf } from 'pomelo-protobuf';
import { Application } from '../application';
export default function (app: any, opts: any): ProtobufComponent;
export declare class ProtobufComponent {
    app: Application;
    watchers: {};
    serverProtos: {};
    clientProtos: {};
    version: string;
    serverProtosPath: string;
    clientProtosPath: string;
    protobuf: Protobuf;
    constructor(app: any, opts: any);
    name: string;
    encode: (key: any, msg: any) => any;
    encode2Bytes: (key: any, msg: any) => any;
    decode: (key: any, msg: any) => any;
    getProtos: () => {
        server: any;
        client: any;
        version: any;
    };
    getVersion: () => any;
    setProtos: (type: any, path: any) => void;
    onUpdate: (type: any, path: any, event: any) => void;
    stop: (force: any, cb: any) => void;
}
