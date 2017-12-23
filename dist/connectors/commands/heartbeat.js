"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pomelo_protocol_1 = require("pomelo-protocol");
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
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
        this.handle = function (socket) {
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
            socket.sendRaw(pomelo_protocol_1.Package.encode(pomelo_protocol_1.Package.TYPE_HEARTBEAT));
            if (self.disconnectOnTimeout) {
                self.timeouts[socket.id] = setTimeout(function () {
                    logger.info('client %j heartbeat timeout.', socket.id);
                    socket.disconnect();
                }, self.timeout);
            }
        };
        this.clear = function (id) {
            var tid = this.timeouts[id];
            if (tid) {
                clearTimeout(tid);
                delete this.timeouts[id];
            }
        };
        opts = opts || {};
        this.disconnectOnTimeout = opts.disconnectOnTimeout;
        if (opts.heartbeat) {
            this.heartbeat = opts.heartbeat * 1000; // heartbeat interval
            this.timeout = opts.timeout * 1000 || this.heartbeat * 2; // max heartbeat message timeout
            this.disconnectOnTimeout = true;
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