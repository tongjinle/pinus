"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const events_1 = require("events");
const ws_1 = require("ws");
var ST_STARTED = 1;
var ST_CLOSED = 2;
/**
 * websocket protocol processor
 */
class WSProcessor extends events_1.EventEmitter {
    constructor() {
        super();
        this.add = function (socket, data) {
            if (this.state !== ST_STARTED) {
                return;
            }
            this.httpServer.emit('connection', socket);
            if (typeof socket.ondata === 'function') {
                // compatible with stream2
                socket.ondata(data, 0, data.length);
            }
            else {
                // compatible with old stream
                socket.emit('data', data);
            }
        };
        this.close = function () {
            if (this.state !== ST_STARTED) {
                return;
            }
            this.state = ST_CLOSED;
            this.wsServer.close();
            this.wsServer = null;
            this.httpServer = null;
        };
        this.httpServer = new http_1.Server();
        var self = this;
        this.wsServer = new ws_1.Server({ server: this.httpServer });
        this.wsServer.on('connection', function (socket) {
            // emit socket to outside
            self.emit('connection', socket);
        });
        this.state = ST_STARTED;
    }
    ;
}
exports.WSProcessor = WSProcessor;
//# sourceMappingURL=wsprocessor.js.map