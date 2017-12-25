"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_protocol_1 = require("pinus-protocol");
const pinus_logger_1 = require("pinus-logger");
var logger = pinus_logger_1.getLogger('pinus', __filename);
var handlers = {};
var ST_INITED = 0;
var ST_WAIT_ACK = 1;
var ST_WORKING = 2;
var ST_CLOSED = 3;
var handleHandshake = function (socket, pkg) {
    if (socket.state !== ST_INITED) {
        return;
    }
    try {
        socket.emit('handshake', JSON.parse(pinus_protocol_1.Protocol.strdecode(pkg.body)));
    }
    catch (ex) {
        socket.emit('handshake', {});
    }
};
var handleHandshakeAck = function (socket, pkg) {
    if (socket.state !== ST_WAIT_ACK) {
        return;
    }
    socket.state = ST_WORKING;
    socket.emit('heartbeat');
};
var handleHeartbeat = function (socket, pkg) {
    if (socket.state !== ST_WORKING) {
        return;
    }
    socket.emit('heartbeat');
};
var handleData = function (socket, pkg) {
    if (socket.state !== ST_WORKING) {
        return;
    }
    socket.emit('message', pkg);
};
handlers[pinus_protocol_1.Package.TYPE_HANDSHAKE] = handleHandshake;
handlers[pinus_protocol_1.Package.TYPE_HANDSHAKE_ACK] = handleHandshakeAck;
handlers[pinus_protocol_1.Package.TYPE_HEARTBEAT] = handleHeartbeat;
handlers[pinus_protocol_1.Package.TYPE_DATA] = handleData;
function default_1(socket, pkg) {
    var handler = handlers[pkg.type];
    if (!!handler) {
        handler(socket, pkg);
    }
    else {
        logger.error('could not find handle invalid data package.');
        socket.disconnect();
    }
}
exports.default = default_1;
;
//# sourceMappingURL=handler.js.map