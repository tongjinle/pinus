"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("pomelo-logger");
/**
 * Configure pomelo logger
 */
function configure(app, filename) {
    var serverId = app.getServerId();
    var base = app.getBase();
    logger.configure(filename, { serverId: serverId, base: base });
}
exports.configure = configure;
;
//# sourceMappingURL=log.js.map