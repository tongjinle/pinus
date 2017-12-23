"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const backendSessionService_1 = require("../common/service/backendSessionService");
class BackendSessionComponent {
    constructor(app) {
        this.name = '__backendSession__';
        var service = new backendSessionService_1.BackendSessionService(app);
        // export backend session service to the application context.
        app.set('backendSessionService', service);
        return service;
    }
    ;
}
exports.BackendSessionComponent = BackendSessionComponent;
//# sourceMappingURL=backendSession.js.map