"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("pinus-logger");
/**
 * Configure pinus logger
 */
function configure(app, filename) {
    var serverId = app.getServerId();
    var base = app.getBase();
    logger.configure(filename, { serverId: serverId, base: base });
}
exports.configure = configure;
;
//# sourceMappingURL=log.js.map