"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const http_1 = require("http");
var httpServer = http_1.createServer();
const siosocket_1 = require("./siosocket");
var PKG_ID_BYTES = 4;
var PKG_ROUTE_LENGTH_BYTES = 1;
var PKG_HEAD_BYTES = PKG_ID_BYTES + PKG_ROUTE_LENGTH_BYTES;
var curId = 1;
/**
 * Connector that manager low level connection and protocol bewteen server and client.
 * Develper can provide their own connector to switch the low level prototol, such as tcp or probuf.
 */
class SIOConnector extends events_1.EventEmitter {
    constructor(port, host, opts) {
        super();
        this.port = port;
        this.host = host;
        this.opts = opts;
        this.heartbeats = opts.heartbeats || true;
        this.closeTimeout = opts.closeTimeout || 60;
        this.heartbeatTimeout = opts.heartbeatTimeout || 60;
        this.heartbeatInterval = opts.heartbeatInterval || 25;
    }
    ;
    /**
     * Start connector to listen the specified port
     */
    start(cb) {
        var self = this;
        // issue https://github.com/NetEase/pinus-cn/issues/174
        var opts = {};
        if (!!this.opts) {
            opts = this.opts;
        }
        else {
            opts = {
                transports: [
                    'websocket', 'polling-xhr', 'polling-jsonp', 'polling'
                ]
            };
        }
        var sio = require('socket.io')(httpServer, opts);
        var port = this.port;
        httpServer.listen(port, function () {
            console.log('sio Server listening at port %d', port);
        });
        sio.set('path', '/socket.io');
        sio.set('transports', this.opts.transports);
        sio.set('close timeout', this.closeTimeout);
        sio.set('heartbeat timeout', this.heartbeatTimeout);
        sio.set('heartbeat interval', this.heartbeatInterval);
        sio.set('heartbeats', this.heartbeats);
        sio.set('log level', 1);
        sio.on('connection', function (socket) {
            // this.wsocket.sockets.on('connection', function (socket) {
            var siosocket = new siosocket_1.SioSocket(curId++, socket);
            this.siosocket = siosocket;
            self.emit('connection', siosocket);
            siosocket.on('closing', function (reason) {
                siosocket.send({ route: 'onKick', reason: reason });
            });
        });
        process.nextTick(cb);
    }
    ;
    /**
     * Stop connector
     */
    stop(force, cb) {
        this.siosocket.server.close();
        process.nextTick(cb);
    }
    ;
    encode(reqId, route, msg) {
        if (reqId) {
            return composeResponse(reqId, route, msg);
        }
        else {
            return composePush(route, msg);
        }
    }
    ;
    /**
     * Decode client message package.
     *
     * Package format:
     *   message id: 4bytes big-endian integer
     *   route length: 1byte
     *   route: route length bytes
     *   body: the rest bytes
     *
     * @param  {String} data socket.io package from client
     * @return {Object}      message object
     */
    decode(msg) {
        var index = 0;
        var id = parseIntField(msg, index, PKG_ID_BYTES);
        index += PKG_ID_BYTES;
        var routeLen = parseIntField(msg, index, PKG_ROUTE_LENGTH_BYTES);
        var route = msg.substr(PKG_HEAD_BYTES, routeLen);
        var body = msg.substr(PKG_HEAD_BYTES + routeLen);
        return {
            id: id,
            route: route,
            body: JSON.parse(body)
        };
    }
    ;
}
exports.SIOConnector = SIOConnector;
var composeResponse = function (msgId, route, msgBody) {
    return {
        id: msgId,
        body: msgBody
    };
};
var composePush = function (route, msgBody) {
    return JSON.stringify({ route: route, body: msgBody });
};
var parseIntField = function (str, offset, len) {
    var res = 0;
    for (var i = 0; i < len; i++) {
        if (i > 0) {
            res <<= 8;
        }
        res |= str.charCodeAt(offset + i) & 0xff;
    }
    return res;
};
//# sourceMappingURL=sioconnector.js.map