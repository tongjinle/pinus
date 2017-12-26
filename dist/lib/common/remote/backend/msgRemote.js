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
var logger = pinus_logger_1.getLogger('forward-log', __filename);
/**
 * Remote service for backend servers.
 * Receive and handle request message forwarded from frontend server.
 */
function default_1(app) {
    return new MsgRemote(app);
}
exports.default = default_1;
;
class MsgRemote {
    constructor(app) {
        this.app = app;
    }
    ;
    /**
     * Forward message from frontend server to other server's handlers
     *
     * @param msg {Object} request message
     * @param session {Object} session object for current request
     * @param cb {Function} callback function
     */
    forwardMessage(msg, session) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var server = this.app.components.__server__;
                var sessionService = this.app.components.__backendSession__;
                if (!server) {
                    logger.error('server component not enable on %s', this.app.serverId);
                    reject(new Error('server component not enable'));
                    return;
                }
                if (!sessionService) {
                    logger.error('backend session component not enable on %s', this.app.serverId);
                    reject(new Error('backend sesssion component not enable'));
                    return;
                }
                // generate backend session for current request
                var backendSession = sessionService.create(session);
                // handle the request
                logger.debug('backend server [%s] handle message: %j', this.app.serverId, msg);
                server.handle(msg, backendSession, function (err, resp, opts) {
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
    forwardMessage2(route, body, aesPassword, compressGzip, session) {
        return new Promise((resolve, reject) => {
            var server = this.app.components.__server__;
            var sessionService = this.app.components.__backendSession__;
            if (!server) {
                logger.error('server component not enable on %s', this.app.serverId);
                reject(new Error('server component not enable'));
                return;
            }
            if (!sessionService) {
                logger.error('backend session component not enable on %s', this.app.serverId);
                reject(new Error('backend sesssion component not enable'));
                return;
            }
            // generate backend session for current request
            var backendSession = sessionService.create(session);
            // handle the request
            // logger.debug('backend server [%s] handle message: %j', this.app.serverId, msg);
            var dmsg = {
                route: route,
                body: body,
                compressGzip: compressGzip
            };
            var socket = {
                aesPassword: aesPassword
            };
            var connector = this.app.components.__connector__.connector;
            connector.runDecode(dmsg, socket, function (err, msg) {
                if (err) {
                    return reject(err);
                }
                server.handle(msg, backendSession, function (err, resp, opts) {
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
exports.MsgRemote = MsgRemote;
//# sourceMappingURL=msgRemote.js.map