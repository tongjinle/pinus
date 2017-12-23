"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const pomelo_protobuf_1 = require("pomelo-protobuf");
const Constants = require("../util/constants");
const crypto = require("crypto");
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
function default_1(app, opts) {
    return new ProtobufComponent(app, opts);
}
exports.default = default_1;
;
class ProtobufComponent {
    constructor(app, opts) {
        this.watchers = {};
        this.serverProtos = {};
        this.clientProtos = {};
        this.version = "";
        this.name = '__protobuf__';
        this.encode = function (key, msg) {
            return this.protobuf.encode(key, msg);
        };
        this.encode2Bytes = function (key, msg) {
            return this.protobuf.encode2Bytes(key, msg);
        };
        this.decode = function (key, msg) {
            return this.protobuf.decode(key, msg);
        };
        this.getProtos = function () {
            return {
                server: this.serverProtos,
                client: this.clientProtos,
                version: this.version
            };
        };
        this.getVersion = function () {
            return this.version;
        };
        this.setProtos = function (type, path) {
            if (!fs.existsSync(path)) {
                return;
            }
            if (type === Constants.RESERVED.SERVER) {
                this.serverProtos = this.protobuf.parse(require(path));
            }
            if (type === Constants.RESERVED.CLIENT) {
                this.clientProtos = this.protobuf.parse(require(path));
            }
            var protoStr = JSON.stringify(this.clientProtos) + JSON.stringify(this.serverProtos);
            this.version = crypto.createHash('md5').update(protoStr).digest('base64');
            //Watch file
            var watcher = fs.watch(path, this.onUpdate.bind(this, type, path));
            if (this.watchers[type]) {
                this.watchers[type].close();
            }
            this.watchers[type] = watcher;
        };
        this.onUpdate = function (type, path, event) {
            if (event !== 'change') {
                return;
            }
            var self = this;
            fs.readFile(path, 'utf8', function (err, data) {
                try {
                    var protos = this.protobuf.parse(JSON.parse(data));
                    if (type === Constants.RESERVED.SERVER) {
                        this.protobuf.setEncoderProtos(protos);
                        self.serverProtos = protos;
                    }
                    else {
                        this.protobuf.setDecoderProtos(protos);
                        self.clientProtos = protos;
                    }
                    var protoStr = JSON.stringify(self.clientProtos) + JSON.stringify(self.serverProtos);
                    self.version = crypto.createHash('md5').update(protoStr).digest('base64');
                    logger.info('change proto file , type : %j, path : %j, version : %j', type, path, self.version);
                }
                catch (e) {
                    logger.warn("change proto file error! path : %j", path);
                    logger.warn(e);
                }
            });
        };
        this.stop = function (force, cb) {
            for (var type in this.watchers) {
                this.watchers[type].close();
            }
            this.watchers = {};
            process.nextTick(cb);
        };
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
        this.protobuf = new pomelo_protobuf_1.Protobuf({ encoderProtos: this.serverProtos, decoderProtos: this.clientProtos });
    }
    ;
}
exports.ProtobufComponent = ProtobufComponent;
//# sourceMappingURL=protobuf.js.map