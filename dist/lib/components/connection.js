"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connectionService_1 = require("../common/service/connectionService");
class ConnectionComponent extends connectionService_1.ConnectionService {
    constructor(app) {
        super(app);
        this.name = '__connection__';
    }
    ;
}
exports.ConnectionComponent = ConnectionComponent;
//# sourceMappingURL=connection.js.map