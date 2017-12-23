"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for server starup.
 */
const server_1 = require("../server/server");
/**
 * Component factory function
 *
 * @param {Object} app  current application context
 * @return {Object}     component instance
 */
function default_1(app, opts) {
    return new ServerComponent(app, opts);
}
exports.default = default_1;
;
/**
 * Server component class
 *
 * @param {Object} app  current application context
 */
class ServerComponent {
    constructor(app, opts) {
        this.name = '__server__';
        /**
         * Component lifecycle callback
         *
         * @param {Function} cb
         * @return {Void}
         */
        this.start = function (cb) {
            this.server.start();
            process.nextTick(cb);
        };
        /**
         * Component lifecycle callback
         *
         * @param {Function} cb
         * @return {Void}
         */
        this.afterStart = function (cb) {
            this.server.afterStart();
            process.nextTick(cb);
        };
        /**
         * Component lifecycle function
         *
         * @param {Boolean}  force whether stop the component immediately
         * @param {Function}  cb
         * @return {Void}
         */
        this.stop = function (force, cb) {
            this.server.stop();
            process.nextTick(cb);
        };
        /**
         * Proxy server handle
         */
        this.handle = function (msg, session, cb) {
            this.server.handle(msg, session, cb);
        };
        /**
         * Proxy server global handle
         */
        this.globalHandle = function (msg, session, cb) {
            this.server.globalHandle(msg, session, cb);
        };
        this.server = server_1.create(app, opts);
    }
    ;
}
exports.ServerComponent = ServerComponent;
//# sourceMappingURL=server.js.map