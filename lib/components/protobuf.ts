import * as fs from 'fs';
import * as path from 'path';
import { Protobuf} from 'pomelo-protobuf';
import * as Constants from '../util/constants';
import * as crypto from 'crypto';
import { getLogger } from 'pomelo-logger'; import { Application } from '../application';
import { Component } from '../interfaces/Component';
 var logger = getLogger('pomelo', __filename);

export default function(app, opts) {
    return new ProtobufComponent (app, opts);
};

export class ProtobufComponent implements Component
{
    app: Application;

    watchers = {};
    serverProtos = {};
    clientProtos = {};
    version = "";
    serverProtosPath: string;
    clientProtosPath: string;

    protobuf: Protobuf;
    name = '__protobuf__';

    constructor(app, opts)
    {
        this.app = app;
        opts = opts || {};

        var env = app.get(Constants.RESERVED.ENV);
        var originServerPath = path.join(app.getBase(), Constants.FILEPATH.SERVER_PROTOS);
        var presentServerPath = path.join(Constants.FILEPATH.CONFIG_DIR, env, path.basename(Constants.FILEPATH.SERVER_PROTOS));
        var originClientPath = path.join(app.getBase(), Constants.FILEPATH.CLIENT_PROTOS);
        var presentClientPath = path.join(Constants.FILEPATH.CONFIG_DIR, env, path.basename(Constants.FILEPATH.CLIENT_PROTOS));

        this.serverProtosPath = opts.serverProtos || (fs.existsSync(originServerPath) ? Constants.FILEPATH.SERVER_PROTOS : presentServerPath);
        this.clientProtosPath = opts.clientProtos || (fs.existsSync(originClientPath) ? Constants.FILEPATH.CLIENT_PROTOS : presentClientPath);

        this.setProtos(Constants.RESERVED.SERVER, path.join(app.getBase(), this.serverProtosPath));
        this.setProtos(Constants.RESERVED.CLIENT, path.join(app.getBase(), this.clientProtosPath));

        this.protobuf = new Protobuf({ encoderProtos: this.serverProtos, decoderProtos: this.clientProtos });
    };


    encode(key, msg)
    {
        return this.protobuf.encode(key, msg);
    };

    encode2Bytes(key, msg)
    {
        return this.protobuf.encode2Bytes(key, msg);
    };

    decode(key, msg)
    {
        return this.protobuf.decode(key, msg);
    };

    getProtos()
    {
        return {
            server: this.serverProtos,
            client: this.clientProtos,
            version: this.version
        };
    };

    getVersion()
    {
        return this.version;
    };

    setProtos(type, path)
    {
        if (!fs.existsSync(path))
        {
            return;
        }

        if (type === Constants.RESERVED.SERVER)
        {
            this.serverProtos = this.protobuf.parse(require(path));
        }

        if (type === Constants.RESERVED.CLIENT)
        {
            this.clientProtos = this.protobuf.parse(require(path));
        }

        var protoStr = JSON.stringify(this.clientProtos) + JSON.stringify(this.serverProtos);
        this.version = crypto.createHash('md5').update(protoStr).digest('base64');

        //Watch file
        var watcher = fs.watch(path, this.onUpdate.bind(this, type, path));
        if (this.watchers[type])
        {
            this.watchers[type].close();
        }
        this.watchers[type] = watcher;
    };

    onUpdate(type, path, event)
    {
        if (event !== 'change')
        {
            return;
        }

        var self = this;
        fs.readFile(path, 'utf8', function (err, data)
        {
            try
            {
                var protos = this.protobuf.parse(JSON.parse(data));
                if (type === Constants.RESERVED.SERVER)
                {
                    this.protobuf.setEncoderProtos(protos);
                    self.serverProtos = protos;
                } else
                {
                    this.protobuf.setDecoderProtos(protos);
                    self.clientProtos = protos;
                }

                var protoStr = JSON.stringify(self.clientProtos) + JSON.stringify(self.serverProtos);
                self.version = crypto.createHash('md5').update(protoStr).digest('base64');
                logger.info('change proto file , type : %j, path : %j, version : %j', type, path, self.version);
            } catch (e)
            {
                logger.warn("change proto file error! path : %j", path);
                logger.warn(e);
            }
        });
    };

    stop(force, cb)
    {
        for (var type in this.watchers)
        {
            this.watchers[type].close();
        }
        this.watchers = {};
        process.nextTick(cb);
    };
}