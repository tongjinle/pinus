"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_protocol_1 = require("pinus-protocol");
const pinus_logger_1 = require("pinus-logger");
var logger = pinus_logger_1.getLogger('pinus', __filename);
/**
 * Process heartbeat request.
 *
 * @param {Object} opts option request
 *                      opts.heartbeat heartbeat interval
 */
class HeartbeatCommand {
    constructor(opts) {
        this.heartbeat = null;
        this.timeout = null;
        this.timeouts = {};
        this.clients = {};
        opts = opts || {};
        this.disconnectOnTimeout = opts.disconnectOnTimeout;
        if (opts.heartbeat) {
            this.heartbeat = opts.heartbeat * 1000; // heartbeat interval
            this.timeout = opts.timeout * 1000 || this.heartbeat * 2; // max heartbeat message timeout
            this.disconnectOnTimeout = true;
        }
    }
    ;
    handle(socket) {
        if (!this.heartbeat) {
            // no heartbeat setting
            return;
        }
        var self = this;
        if (!this.clients[socket.id]) {
            // clear timers when socket disconnect or error
            this.clients[socket.id] = 1;
            socket.once('disconnect', clearTimers.bind(null, this, socket.id));
            socket.once('error', clearTimers.bind(null, this, socket.id));
        }
        // clear timeout timer
        if (self.disconnectOnTimeout) {
            this.clear(socket.id);
        }
        socket.sendRaw(pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_HEARTBEAT));
        if (self.disconnectOnTimeout) {
            self.timeouts[socket.id] = setTimeout(function () {
                logger.info('client %j heartbeat timeout.', socket.id);
                socket.disconnect();
            }, self.timeout);
        }
    }
    ;
    clear(id) {
        var tid = this.timeouts[id];
        if (tid) {
            clearTimeout(tid);
            delete this.timeouts[id];
        }
    }
    ;
}
exports.HeartbeatCommand = HeartbeatCommand;
var clearTimers = function (self, id) {
    delete self.clients[id];
    var tid = self.timeouts[id];
    if (tid) {
        clearTimeout(tid);
        delete self.timeouts[id];
    }
};
//# sourceMappingURL=heartbeat.js.map