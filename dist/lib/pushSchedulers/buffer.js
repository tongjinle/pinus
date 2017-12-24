"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../util/utils");
var DEFAULT_FLUSH_INTERVAL = 20;
class BufferPushScheduler {
    constructor(app, opts) {
        this.sessions = {}; // sid -> msg queue
        this.tid = null;
        opts = opts || {};
        this.app = app;
        this.flushInterval = opts.flushInterval || DEFAULT_FLUSH_INTERVAL;
    }
    ;
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.tid = setInterval(this.flush.bind(this), this.flushInterval);
        });
    }
    ;
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tid) {
                clearInterval(this.tid);
                this.tid = null;
            }
        });
    }
    ;
    schedule(reqId, route, msg, recvs, opts, cb) {
        opts = opts || {};
        if (opts.type === 'broadcast') {
            doBroadcast(this, msg, opts.userOptions);
        }
        else {
            doBatchPush(this, msg, recvs);
        }
        process.nextTick(function () {
            utils.invokeCallback(cb);
        });
    }
    ;
    flush() {
        var sessionService = this.app.get('sessionService');
        var queue, session;
        for (var sid in this.sessions) {
            session = sessionService.get(sid);
            if (!session) {
                continue;
            }
            queue = this.sessions[sid];
            if (!queue || queue.length === 0) {
                continue;
            }
            session.sendBatch(queue);
            this.sessions[sid] = [];
        }
    }
    ;
}
exports.BufferPushScheduler = BufferPushScheduler;
var doBroadcast = function (self, msg, opts) {
    var channelService = self.app.get('channelService');
    var sessionService = self.app.get('sessionService');
    if (opts.binded) {
        sessionService.forEachBindedSession(function (session) {
            if (channelService.broadcastFilter &&
                !channelService.broadcastFilter(session, msg, opts.filterParam)) {
                return;
            }
            enqueue(self, session, msg);
        });
    }
    else {
        sessionService.forEachSession(function (session) {
            if (channelService.broadcastFilter &&
                !channelService.broadcastFilter(session, msg, opts.filterParam)) {
                return;
            }
            enqueue(self, session, msg);
        });
    }
};
var doBatchPush = function (self, msg, recvs) {
    var sessionService = self.app.get('sessionService');
    var session;
    for (var i = 0, l = recvs.length; i < l; i++) {
        session = sessionService.get(recvs[i]);
        if (session) {
            enqueue(self, session, msg);
        }
    }
};
var enqueue = function (self, session, msg) {
    var queue = self.sessions[session.id];
    if (!queue) {
        queue = self.sessions[session.id] = [];
        session.once('closed', onClose.bind(null, self));
    }
    queue.push(msg);
};
var onClose = function (self, session) {
    delete self.sessions[session.id];
};
//# sourceMappingURL=buffer.js.map