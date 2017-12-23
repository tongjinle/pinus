"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter to keep request sequence.
 */
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
const taskManager = require("../../common/manager/taskManager");
function default_1(timeout) {
    return new SerialFilter(timeout);
}
exports.default = default_1;
;
class SerialFilter {
    constructor(timeout) {
        this.timeout = timeout;
    }
    ;
    /**
     * request serialization after filter
     */
    before(msg, session, next) {
        taskManager.addTask(session.id, function (task) {
            session.__serialTask__ = task;
            next();
        }, function () {
            logger.error('[serial filter] msg timeout, msg:' + JSON.stringify(msg));
        }, this.timeout);
    }
    ;
    /**
     * request serialization after filter
     */
    after(err, msg, session, resp, next) {
        var task = session.__serialTask__;
        if (task) {
            if (!task.done() && !err) {
                err = new Error('task time out. msg:' + JSON.stringify(msg));
            }
        }
        next(err);
    }
    ;
}
exports.SerialFilter = SerialFilter;
//# sourceMappingURL=serial.js.map