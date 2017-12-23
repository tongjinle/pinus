"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pomelo_protocol_1 = require("pomelo-protocol");
const Constants = require("../../util/constants");
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
var encode = function (reqId, route, msg) {
    if (!!reqId) {
        return composeResponse(this, reqId, route, msg);
    }
    else {
        return composePush(this, route, msg);
    }
};
exports.encode = encode;
var decode = function (msg) {
    msg = pomelo_protocol_1.Message.decode(msg.body);
    var route = msg.route;
    // decode use dictionary
    if (!!msg.compressRoute) {
        if (!!this.connector.useDict) {
            var abbrs = this.dictionary.getAbbrs();
            if (!abbrs[route]) {
                logger.error('dictionary error! no abbrs for route : %s', route);
                return null;
            }
            route = msg.route = abbrs[route];
        }
        else {
            logger.error('fail to uncompress route code for msg: %j, server not enable dictionary.', msg);
            return null;
        }
    }
    // decode use protobuf
    if (!!this.protobuf && !!this.protobuf.getProtos().client[route]) {
        msg.body = this.protobuf.decode(route, msg.body);
    }
    else if (!!this.decodeIO_protobuf && !!this.decodeIO_protobuf.check(Constants.RESERVED.CLIENT, route)) {
        msg.body = this.decodeIO_protobuf.decode(route, msg.body);
    }
    else {
        try {
            msg.body = JSON.parse(msg.body.toString('utf8'));
        }
        catch (ex) {
            msg.body = {};
        }
    }
    return msg;
};
exports.decode = decode;
var composeResponse = function (server, msgId, route, msgBody) {
    if (!msgId || !route || !msgBody) {
        return null;
    }
    msgBody = encodeBody(server, route, msgBody);
    return pomelo_protocol_1.Message.encode(msgId, pomelo_protocol_1.Message.TYPE_RESPONSE, 0, null, msgBody);
};
var composePush = function (server, route, msgBody) {
    if (!route || !msgBody) {
        return null;
    }
    msgBody = encodeBody(server, route, msgBody);
    // encode use dictionary
    var compressRoute = 0;
    if (!!server.dictionary) {
        var dict = server.dictionary.getDict();
        if (!!server.connector.useDict && !!dict[route]) {
            route = dict[route];
            compressRoute = 1;
        }
    }
    return pomelo_protocol_1.Message.encode(0, pomelo_protocol_1.Message.TYPE_PUSH, compressRoute, route, msgBody);
};
var encodeBody = function (server, route, msgBody) {
    // encode use protobuf
    if (!!server.protobuf && !!server.protobuf.getProtos().server[route]) {
        msgBody = server.protobuf.encode(route, msgBody);
    }
    else if (!!server.decodeIO_protobuf && !!server.decodeIO_protobuf.check(Constants.RESERVED.SERVER, route)) {
        msgBody = server.decodeIO_protobuf.encode(route, msgBody);
    }
    else {
        msgBody = new Buffer(JSON.stringify(msgBody), 'utf8');
    }
    return msgBody;
};
//# sourceMappingURL=coder.js.map