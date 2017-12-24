"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connectionService_1 = require("../common/service/connectionService");
class ConnectionComponent {
    constructor(app) {
        this.name = '__connection__';
        this.app = app;
        this.service = new connectionService_1.ConnectionService(app);
    }
    ;
}
exports.ConnectionComponent = ConnectionComponent;
//# sourceMappingURL=connection.js.map