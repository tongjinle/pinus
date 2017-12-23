"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channelService_1 = require("../common/service/channelService");
function default_1(app, opts) {
    var service = new channelService_1.ChannelService(app, opts);
    app.set('channelService', service);
    service.name = '__channel__';
    return service;
}
exports.default = default_1;
;
//# sourceMappingURL=channel.js.map