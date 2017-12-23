"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for monitor.
 * Load and start monitor client.
 */
const monitor_1 = require("../monitor/monitor");
/**
 * Component factory function
 *
 * @param  {Object} app  current application context
 * @return {Object}      component instances
 */
function default_1(app, opts) {
    return new MonitorComponent(app, opts);
}
exports.default = default_1;
;
class MonitorComponent {
    constructor(app, opts) {
        this.name = '__monitor__';
        this.monitor = new monitor_1.Monitor(app, opts);
    }
    ;
    start(cb) {
        this.monitor.start(cb);
    }
    ;
    stop(force, cb) {
        this.monitor.stop(cb);
    }
    ;
    reconnect(masterInfo) {
        this.monitor.reconnect(masterInfo);
    }
    ;
}
exports.MonitorComponent = MonitorComponent;
//# sourceMappingURL=monitor.js.map