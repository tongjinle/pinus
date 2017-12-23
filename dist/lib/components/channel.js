"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channelService_1 = require("../common/service/channelService");
class ChannelComponent {
    constructor(app, opts) {
        this.name = '__channel__';
        var service = new channelService_1.ChannelService(app, opts);
        app.set('channelService', service);
        return service;
    }
    ;
}
exports.ChannelComponent = ChannelComponent;
//# sourceMappingURL=channel.js.map