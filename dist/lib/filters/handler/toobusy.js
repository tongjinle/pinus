"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for toobusy.
 * if the process is toobusy, just skip the new request
 */
const pinus_logger_1 = require("pinus-logger");
var conLogger = pinus_logger_1.getLogger('con-log', __filename);
var toobusy = null;
var DEFAULT_MAXLAG = 70;
class ToobusyFilter {
    constructor(maxLag = DEFAULT_MAXLAG) {
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
    before(routeRecord, msg, session, next) {
        if (!!toobusy && toobusy()) {
            conLogger.warn('[toobusy] reject request msg: ' + msg);
            var err = new Error('Server toobusy!');
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