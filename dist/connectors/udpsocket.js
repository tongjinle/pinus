"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("./common/handler");
const pomelo_protocol_1 = require("pomelo-protocol");
const EventEmitter = require("events");
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
var ST_INITED = 0;
var ST_WAIT_ACK = 1;
var ST_WORKING = 2;
var ST_CLOSED = 3;
class UdpSocket extends EventEmitter {
    constructor(id, socket, peer) {
        super();
        /**
         * Send byte data package to client.
         *
         * @param  {Buffer} msg byte data
         */
        this.send = function (msg) {
            if (this.state !== ST_WORKING) {
                return;
            }
            if (msg instanceof String) {
                msg = new Buffer(msg);
            }
            else if (!(msg instanceof Buffer)) {
                msg = new Buffer(JSON.stringify(msg));
            }
            this.sendRaw(pomelo_protocol_1.Package.encode(pomelo_protocol_1.Package.TYPE_DATA, msg));
        };
        this.sendRaw = function (msg) {
            this.socket.send(msg, 0, msg.length, this.port, this.host, function (err, bytes) {
                if (!!err) {
                    logger.error('send msg to remote with err: %j', err.stack);
                    return;
                }
            });
        };
        this.sendForce = function (msg) {
            if (this.state === ST_CLOSED) {
                return;
            }
            this.sendRaw(msg);
        };
        this.handshakeResponse = function (resp) {
            if (this.state !== ST_INITED) {
                return;
            }
            this.sendRaw(resp);
            this.state = ST_WAIT_ACK;
        };
        this.sendBatch = function (msgs) {
            if (this.state !== ST_WORKING) {
                return;
            }
            var rs = [];
            for (var i = 0; i < msgs.length; i++) {
                var src = pomelo_protocol_1.Package.encode(pomelo_protocol_1.Package.TYPE_DATA, msgs[i]);
                rs.push(src);
            }
            this.sendRaw(Buffer.concat(rs));
        };
        this.disconnect = function () {
            if (this.state === ST_CLOSED) {
                return;
            }
            this.state = ST_CLOSED;
            this.emit('disconnect', 'the connection is disconnected.');
        };
        this.id = id;
        this.socket = socket;
        this.peer = peer;
        this.host = peer.address;
        this.port = peer.port;
        this.remoteAddress = {
            ip: this.host,
            port: this.port
        };
        var self = this;
        this.on('package', function (pkg) {
            if (!!pkg) {
                pkg = pomelo_protocol_1.Package.decode(pkg);
                handler_1.default(self, pkg);
            }
        });
        this.state = ST_INITED;
    }
    ;
}
exports.UdpSocket = UdpSocket;
//# sourceMappingURL=udpsocket.js.map