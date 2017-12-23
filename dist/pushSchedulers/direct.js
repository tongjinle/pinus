"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../util/utils");
class DirectService {
    constructor(app, opts) {
        this.schedule = function (reqId, route, msg, recvs, opts, cb) {
            opts = opts || {};
            if (opts.type === 'broadcast') {
                doBroadcast(this, msg, opts.userOptions);
            }
            else {
                doBatchPush(this, msg, recvs);
            }
            if (cb) {
                process.nextTick(function () {
                    utils.invokeCallback(cb);
                });
            }
        };
        opts = opts || {};
        this.app = app;
    }
    ;
}
exports.DirectService = DirectService;
var doBroadcast = function (self, msg, opts) {
    var channelService = self.app.get('channelService');
    var sessionService = self.app.get('sessionService');
    if (opts.binded) {
        sessionService.forEachBindedSession(function (session) {
            if (channelService.broadcastFilter &&
                !channelService.broadcastFilter(session, msg, opts.filterParam)) {
                return;
            }
            sessionService.sendMessageByUid(session.uid, msg);
        });
    }
    else {
        sessionService.forEachSession(function (session) {
            if (channelService.broadcastFilter &&
                !channelService.broadcastFilter(session, msg, opts.filterParam)) {
                return;
            }
            sessionService.sendMessage(session.id, msg);
        });
    }
};
var doBatchPush = function (self, msg, recvs) {
    var sessionService = self.app.get('sessionService');
    for (var i = 0, l = recvs.length; i < l; i++) {
        sessionService.sendMessage(recvs[i], msg);
    }
};
//# sourceMappingURL=direct.js.map