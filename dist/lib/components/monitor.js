"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for monitor.
 * Load and start monitor client.
 */
const monitor_1 = require("../monitor/monitor");
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