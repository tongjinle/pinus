"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const tls = require("tls");
const events_1 = require("events");
const hybridsocket_1 = require("./hybridsocket");
const switcher_1 = require("./hybrid/switcher");
const handshake_1 = require("./commands/handshake");
const heartbeat_1 = require("./commands/heartbeat");
const Kick = require("./commands/kick");
const coder = require("./common/coder");
var curId = 1;
/**
 * Connector that manager low level connection and protocol bewteen server and client.
 * Develper can provide their own connector to switch the low level prototol, such as tcp or probuf.
 */
class HybridConnector extends events_1.EventEmitter {
    constructor(port, host, opts) {
        super();
        this.decode = coder.decode;
        this.encode = coder.encode;
        this.opts = opts || {};
        this.port = port;
        this.host = host;
        this.useDict = opts.useDict;
        this.useProtobuf = opts.useProtobuf;
        this.handshake = new handshake_1.HandshakeCommand(opts);
        this.heartbeat = new heartbeat_1.HeartbeatCommand(opts);
        this.distinctHost = opts.distinctHost;
        this.ssl = opts.ssl;
        this.switcher = null;
    }
    ;
    /**
     * Start connector to listen the specified port
     */
    start(cb) {
        var app = require('../pomelo').app;
        var self = this;
        var gensocket = function (socket) {
            var hybridsocket = new hybridsocket_1.HybridSocket(curId++, socket);
            hybridsocket.on('handshake', self.handshake.handle.bind(self.handshake, hybridsocket));
            hybridsocket.on('heartbeat', self.heartbeat.handle.bind(self.heartbeat, hybridsocket));
            hybridsocket.on('disconnect', self.heartbeat.clear.bind(self.heartbeat, hybridsocket.id));
            hybridsocket.on('closing', Kick.handle.bind(null, hybridsocket));
            self.emit('connection', hybridsocket);
        };
        this.connector = app.components.__connector__.connector;
        this.dictionary = app.components.__dictionary__;
        this.protobuf = app.components.__protobuf__;
        this.decodeIO_protobuf = app.components.__decodeIO__protobuf__;
        if (!this.ssl) {
            this.listeningServer = net.createServer();
        }
        else {
            this.listeningServer = tls.createServer(this.ssl);
        }
        this.switcher = new switcher_1.HybridSwitcher(this.listeningServer, self.opts);
        this.switcher.on('connection', function (socket) {
            gensocket(socket);
        });
        if (!!this.distinctHost) {
            this.listeningServer.listen(this.port, this.host);
        }
        else {
            this.listeningServer.listen(this.port);
        }
        process.nextTick(cb);
    }
    ;
    stop(force, cb) {
        this.switcher.close();
        this.listeningServer.close();
        process.nextTick(cb);
    }
    ;
}
exports.HybridConnector = HybridConnector;
//# sourceMappingURL=hybridconnector.js.map