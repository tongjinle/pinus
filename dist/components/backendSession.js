"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backendSessionService_1 = require("../common/service/backendSessionService");
function default_1(app) {
    var service = new backendSessionService_1.BackendSessionService(app);
    service.name = '__backendSession__';
    // export backend session service to the application context.
    app.set('backendSessionService', service, true);
    // for compatibility as `LocalSession` is renamed to `BackendSession` 
    app.set('localSessionService', service, true);
    return service;
}
exports.default = default_1;
;
//# sourceMappingURL=backendSession.js.map