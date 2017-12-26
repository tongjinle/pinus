"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for statistics.
 * Record used time for each request.
 */
const pinus_logger_1 = require("pinus-logger");
var conLogger = pinus_logger_1.getLogger('con-log', __filename);
const utils = require("../../util/utils");
class TimeFilter {
    before(routeRecord, msg, session, next) {
        session.__startTime__ = Date.now();
        next();
    }
    ;
    after(err, routeRecord, msg, session, resp, next) {
        var start = session.__startTime__;
        if (typeof start === 'number') {
            var timeUsed = Date.now() - start;
            var log = {
                route: routeRecord.route,
                args: msg,
                time: utils.format(new Date(start)),
                timeUsed: timeUsed
            };
            conLogger.info(JSON.stringify(log));
        }
        next(err);
    }
    ;
}
exports.TimeFilter = TimeFilter;
//# sourceMappingURL=time.js.map