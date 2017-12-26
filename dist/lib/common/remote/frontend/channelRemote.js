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
const pinus_logger_1 = require("pinus-logger");
var logger = pinus_logger_1.getLogger('pinus', __filename);
function default_1(app) {
    return new ChannelRemote(app);
}
exports.default = default_1;
;
class ChannelRemote {
    constructor(app) {
        this.app = app;
    }
    ;
    /**
     * Push message to client by uids.
     *
     * @param  {String}   route route string of message
     * @param  {Object}   msg   message
     * @param  {Array}    uids  user ids that would receive the message
     * @param  {Object}   opts  push options
     * @param  {Function} cb    callback function
     */
    pushMessage(route, msg, uids, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (!msg) {
                    logger.error('Can not send empty message! route : %j, compressed msg : %j', route, msg);
                    reject(new Error('can not send empty message.'));
                    return;
                }
                var connector = this.app.components.__connector__;
                var sessionService = this.app.get('sessionService');
                var fails = [], sids = [], sessions, j, k;
                for (var i = 0, l = uids.length; i < l; i++) {
                    sessions = sessionService.getByUid(uids[i]);
                    if (!sessions) {
                        fails.push(uids[i]);
                    }
                    else {
                        for (j = 0, k = sessions.length; j < k; j++) {
                            sids.push(sessions[j].id);
                        }
                    }
                }
                logger.debug('[%s] pushMessage uids: %j, msg: %j, sids: %j', this.app.serverId, uids, msg, sids);
                connector.send(null, route, msg, sids, opts, function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(fails);
                    }
                });
            });
        });
    }
    /**
     * Broadcast to all the client connectd with current frontend server.
     *
     * @param  {String}    route  route string
     * @param  {Object}    msg    message
     * @param  {Boolean}   opts   broadcast options.
     * @param  {Function}  cb     callback function
     */
    broadcast(route, msg, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var connector = this.app.components.__connector__;
                connector.send(null, route, msg, null, opts, function (err, resp) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(resp);
                    }
                });
            });
        });
    }
}
exports.ChannelRemote = ChannelRemote;
//# sourceMappingURL=channelRemote.js.map