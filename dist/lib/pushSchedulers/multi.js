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
const util_1 = require("util");
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
class MultiPushScheduler {
    constructor(app, opts) {
        opts = opts || {};
        var scheduler = opts.scheduler;
        if (Array.isArray(scheduler)) {
            this.scheduler = {};
            scheduler.forEach(function (sch) {
                if (typeof sch.scheduler === 'function') {
                    this.scheduler[sch.id] = new sch.scheduler(app, sch.options);
                }
                else {
                    this.scheduler[sch.id] = sch.scheduler;
                }
            });
            if (!util_1.isFunction(opts.selector)) {
                throw new Error("MultiPushScheduler必须提供selector参数");
            }
            this.selector = opts.selector;
        }
        else {
            throw new Error("MultiPushScheduler必须提供scheduler参数");
        }
        this.app = app;
    }
    ;
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            for (var k in this.scheduler) {
                var sch = this.scheduler[k];
                if (typeof sch.start === 'function') {
                    yield sch.start();
                }
            }
        });
    }
    ;
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            for (var k in this.scheduler) {
                var sch = this.scheduler[k];
                if (typeof sch.stop === 'function') {
                    yield sch.stop();
                }
            }
        });
    }
    ;
    /**
     * Schedule how the message to send.
     *
     * @param  {Number}   reqId request id
     * @param  {String}   route route string of the message
     * @param  {Object}   msg   message content after encoded
     * @param  {Array}    recvs array of receiver's session id
     * @param  {Object}   opts  options
     */
    schedule(reqId, route, msg, recvs, opts, cb) {
        var self = this;
        var id = self.selector(reqId, route, msg, recvs, opts);
        if (self.scheduler[id]) {
            self.scheduler[id].schedule(reqId, route, msg, recvs, opts, cb);
        }
        else {
            logger.error('invalid pushScheduler id, id: %j', id);
        }
    }
    ;
}
exports.MultiPushScheduler = MultiPushScheduler;
//# sourceMappingURL=multi.js.map