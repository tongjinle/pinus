"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for rpc log.
 * Reject rpc request when toobusy
 */
const pomelo_logger_1 = require("pomelo-logger");
var rpcLogger = pomelo_logger_1.getLogger('rpc-log', __filename);
var toobusy = null;
var DEFAULT_MAXLAG = 70;
function default_1(maxLag) {
    return new ToobusyFilter(maxLag || DEFAULT_MAXLAG);
}
exports.default = default_1;
;
class ToobusyFilter {
    constructor(maxLag) {
        this.name = 'toobusy';
        try {
            toobusy = require('toobusy');
        }
        catch (e) {
        }
        if (!!toobusy) {
            toobusy.maxLag(maxLag);
        }
    }
    ;
    /**
     * Before filter for rpc
     */
    before(serverId, msg, opts, next) {
        opts = opts || {};
        if (!!toobusy && toobusy()) {
            rpcLogger.warn('Server too busy for rpc request, serverId:' + serverId + ' msg: ' + msg);
            var err = new Error('Backend server ' + serverId + ' is too busy now!');
            err.code = 500;
            next(err);
        }
        else {
            next();
        }
    }
    ;
}
exports.ToobusyFilter = ToobusyFilter;
//# sourceMappingURL=toobusy.js.map