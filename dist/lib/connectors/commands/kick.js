"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pomelo_protocol_1 = require("pomelo-protocol");
function handle(socket, reason) {
    // websocket close code 1000 would emit when client close the connection
    if (typeof reason === 'string') {
        var res = {
            reason: reason
        };
        socket.sendRaw(pomelo_protocol_1.Package.encode(pomelo_protocol_1.Package.TYPE_KICK, new Buffer(JSON.stringify(res))));
    }
}
exports.handle = handle;
;
//# sourceMappingURL=kick.js.map