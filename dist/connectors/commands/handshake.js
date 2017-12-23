"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pomelo_1 = require("../../pomelo");
const pomelo_protocol_1 = require("pomelo-protocol");
var CODE_OK = 200;
var CODE_USE_ERROR = 500;
var CODE_OLD_CLIENT = 501;
/**
 * Process the handshake request.
 *
 * @param {Object} opts option parameters
 *                      opts.handshake(msg, cb(err, resp)) handshake callback. msg is the handshake message from client.
 *                      opts.hearbeat heartbeat interval (level?)
 *                      opts.version required client level
 */
class HandshakeCommand {
    constructor(opts) {
        opts = opts || {};
        this.userHandshake = opts.handshake;
        if (opts.heartbeat) {
            this.heartbeatSec = opts.heartbeat;
            this.heartbeat = opts.heartbeat * 1000;
        }
        this.checkClient = opts.checkClient;
        this.useDict = opts.useDict;
        this.useProtobuf = opts.useProtobuf;
        this.useCrypto = opts.useCrypto;
    }
    ;
    handle(socket, msg) {
        if (!msg.sys) {
            processError(socket, CODE_USE_ERROR);
            return;
        }
        if (typeof this.checkClient === 'function') {
            if (!msg || !msg.sys || !this.checkClient(msg.sys.type, msg.sys.version)) {
                processError(socket, CODE_OLD_CLIENT);
                return;
            }
        }
        var opts = {
            heartbeat: setupHeartbeat(this)
        };
        if (this.useDict) {
            var dictVersion = pomelo_1.pomelo.app.components.__dictionary__.getVersion();
            if (!msg.sys.dictVersion || msg.sys.dictVersion !== dictVersion) {
                // may be deprecated in future
                opts.dict = pomelo_1.pomelo.app.components.__dictionary__.getDict();
                opts.routeToCode = pomelo_1.pomelo.app.components.__dictionary__.getDict();
                opts.codeToRoute = pomelo_1.pomelo.app.components.__dictionary__.getAbbrs();
                opts.dictVersion = dictVersion;
            }
            opts.useDict = true;
        }
        if (this.useProtobuf) {
            var protoVersion = pomelo_1.pomelo.app.components.__protobuf__.getVersion();
            if (!msg.sys.protoVersion || msg.sys.protoVersion !== protoVersion) {
                opts.protos = pomelo_1.pomelo.app.components.__protobuf__.getProtos();
            }
            opts.useProto = true;
        }
        if (!!pomelo_1.pomelo.app.components.__decodeIO__protobuf__) {
            if (!!this.useProtobuf) {
                throw new Error('protobuf can not be both used in the same project.');
            }
            var version = pomelo_1.pomelo.app.components.__decodeIO__protobuf__.getVersion();
            if (!msg.sys.protoVersion || msg.sys.protoVersion < version) {
                opts.protos = pomelo_1.pomelo.app.components.__decodeIO__protobuf__.getProtos();
            }
            opts.useProto = true;
        }
        if (this.useCrypto) {
            pomelo_1.pomelo.app.components.__connector__.setPubKey(socket.id, msg.sys.rsa);
        }
        if (typeof this.userHandshake === 'function') {
            this.userHandshake(msg, function (err, resp) {
                if (err) {
                    process.nextTick(function () {
                        processError(socket, CODE_USE_ERROR);
                    });
                    return;
                }
                process.nextTick(function () {
                    response(socket, opts, resp);
                });
            }, socket);
            return;
        }
        process.nextTick(function () {
            response(socket, opts);
        });
    }
    ;
}
exports.HandshakeCommand = HandshakeCommand;
var setupHeartbeat = function (self) {
    return self.heartbeatSec;
};
var response = function (socket, sys, resp) {
    var res = {
        code: CODE_OK,
        sys: sys
    };
    if (resp) {
        res.user = resp;
    }
    socket.handshakeResponse(pomelo_protocol_1.Package.encode(pomelo_protocol_1.Package.TYPE_HANDSHAKE, new Buffer(JSON.stringify(res))));
};
var processError = function (socket, code) {
    var res = {
        code: code
    };
    socket.sendForce(pomelo_protocol_1.Package.encode(pomelo_protocol_1.Package.TYPE_HANDSHAKE, new Buffer(JSON.stringify(res))));
    process.nextTick(function () {
        socket.disconnect();
    });
};
//# sourceMappingURL=handshake.js.map