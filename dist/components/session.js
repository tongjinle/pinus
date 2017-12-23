"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionService_1 = require("../common/service/sessionService");
function default_1(app, opts) {
    var cmp = new SessionComponent(app, opts);
    app.set('sessionService', cmp, true);
    return cmp;
}
exports.default = default_1;
;
/**
 * Session component. Manage sessions.
 *
 * @param {Object} app  current application context
 * @param {Object} opts attach parameters
 */
class SessionComponent {
    constructor(app, opts) {
        this.name = '__session__';
        opts = opts || {};
        this.app = app;
        this.service = new sessionService_1.SessionService(opts);
        var getFun = function (m) {
            return (function () {
                return function () {
                    return self.service[m].apply(self.service, arguments);
                };
            })();
        };
        // proxy the service methods except the lifecycle interfaces of component
        var method, self = this;
        for (var m in this.service) {
            if (m !== 'start' && m !== 'stop') {
                method = this.service[m];
                if (typeof method === 'function') {
                    this[m] = getFun(m);
                }
            }
        }
    }
    ;
}
exports.SessionComponent = SessionComponent;
//# sourceMappingURL=session.js.map