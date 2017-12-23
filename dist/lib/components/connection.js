"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connectionService_1 = require("../common/service/connectionService");
class ConnectionComponent {
    constructor(app) {
        this.name = '__connection__';
        this.app = app;
        this.service = new connectionService_1.ConnectionService(app);
        // proxy the service methods except the lifecycle interfaces of component
        var method, self = this;
        var getFun = function (m) {
            return (function () {
                return function () {
                    return self.service[m].apply(self.service, arguments);
                };
            })();
        };
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
exports.ConnectionComponent = ConnectionComponent;
//# sourceMappingURL=connection.js.map