"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_protocol_1 = require("pinus-protocol");
function handle(socket, reason) {
    // websocket close code 1000 would emit when client close the connection
    if (typeof reason === 'string') {
        var res = {
            reason: reason
        };
        socket.sendRaw(pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_KICK, new Buffer(JSON.stringify(res))));
    }
}
exports.handle = handle;
;
//# sourceMappingURL=kick.js.map