"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for toobusy.
 * if the process is toobusy, just skip the new request
 */
const pomelo_logger_1 = require("pomelo-logger");
var conLogger = pomelo_logger_1.getLogger('con-log', __filename);
var toobusy = null;
var DEFAULT_MAXLAG = 70;
function default_1(maxLag) {
    return new ToobusyFilterHandler(maxLag || DEFAULT_MAXLAG);
}
exports.default = default_1;
;
class ToobusyFilterHandler {
    constructor(maxLag) {
        this.before = function (msg, session, next) {
            if (!!toobusy && toobusy()) {
                conLogger.warn('[toobusy] reject request msg: ' + msg);
                var err = new Error('Server toobusy!');
                err.code = 500;
                next(err);
            }
            else {
                next();
            }
        };
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
}
exports.ToobusyFilterHandler = ToobusyFilterHandler;
//# sourceMappingURL=toobusy.js.map