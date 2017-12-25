"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../../../util/utils");
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
        /**
         * Forward message from frontend server to other server's handlers
         *
         * @param msg {Object} request message
         * @param session {Object} session object for current request
         * @param cb {Function} callback function
         */
        this.forwardMessage = utils.promisify((msg, session, cb) => {
            var server = this.app.components.__server__;
            var sessionService = this.app.components.__backendSession__;
            if (!server) {
                logger.error('server component not enable on %s', this.app.serverId);
                utils.invokeCallback(cb, new Error('server component not enable'));
                return;
            }
            if (!sessionService) {
                logger.error('backend session component not enable on %s', this.app.serverId);
                utils.invokeCallback(cb, new Error('backend sesssion component not enable'));
                return;
            }
            // generate backend session for current request
            var backendSession = sessionService.create(session);
            // handle the request
            logger.debug('backend server [%s] handle message: %j', this.app.serverId, msg);
            server.handle(msg, backendSession, function (err, resp, opts) {
                // cb && cb(err, resp, opts);
                utils.invokeCallback(cb, err, resp, opts);
            });
        });
        this.forwardMessage2 = utils.promisify((route, body, aesPassword, compressGzip, session, cb) => {
            var server = this.app.components.__server__;
            var sessionService = this.app.components.__backendSession__;
            if (!server) {
                logger.error('server component not enable on %s', this.app.serverId);
                utils.invokeCallback(cb, new Error('server component not enable'));
                return;
            }
            if (!sessionService) {
                logger.error('backend session component not enable on %s', this.app.serverId);
                utils.invokeCallback(cb, new Error('backend sesssion component not enable'));
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
                    return cb(err);
                }
                server.handle(msg, backendSession, function (err, resp, opts) {
                    utils.invokeCallback(cb, err, resp, opts);
                });
            });
        });
        this.app = app;
    }
    ;
}
exports.MsgRemote = MsgRemote;
//# sourceMappingURL=msgRemote.js.map