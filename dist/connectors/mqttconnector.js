"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const mqtt = require("mqtt");
const constants = require("../util/constants");
const mqttsocket_1 = require("./mqttsocket");
const mqttadaptor_1 = require("./mqtt/mqttadaptor");
const generate = require("./mqtt/generate");
const pomelo_logger_1 = require("pomelo-logger");
var logger = pomelo_logger_1.getLogger('pomelo', __filename);
var curId = 1;
/**
 * Connector that manager low level connection and protocol bewteen server and client.
 * Develper can provide their own connector to switch the low level prototol, such as tcp or probuf.
 */
class MQTTConnector extends events_1.EventEmitter {
    constructor(port, host, opts) {
        super();
        /**
         * Start connector to listen the specified port
         */
        this.start = function (cb) {
            var self = this;
            this.mqttServer = mqtt.createServer();
            this.mqttServer.on('client', function (client) {
                client.on('error', function (err) {
                    client.stream.destroy();
                });
                client.on('close', function () {
                    client.stream.destroy();
                });
                client.on('disconnect', function (packet) {
                    client.stream.destroy();
                });
                if (self.opts.disconnectOnTimeout) {
                    var timeout = self.opts.timeout * 1000 || constants.TIME.DEFAULT_MQTT_HEARTBEAT_TIMEOUT;
                    client.stream.setTimeout(timeout, function () {
                        client.emit('close');
                    });
                }
                client.on('connect', function (packet) {
                    client.connack({ returnCode: 0 });
                    var mqttsocket = new mqttsocket_1.MQTTSocket(curId++, client, self.adaptor);
                    self.emit('connection', mqttsocket);
                });
            });
            this.mqttServer.listen(this.port);
            process.nextTick(cb);
        };
        this.stop = function () {
            this.mqttServer.close();
            process.exit(0);
        };
        this.encode = function (reqId, route, msgBody) {
            if (!!reqId) {
                return composeResponse(reqId, route, msgBody);
            }
            else {
                return composePush(route, msgBody);
            }
        };
        this.close = function () {
            this.mqttServer.close();
        };
        this.port = port;
        this.host = host;
        this.opts = opts || {};
        this.adaptor = new mqttadaptor_1.MqttAdaptor(this.opts);
    }
    ;
}
exports.MQTTConnector = MQTTConnector;
var composeResponse = function (msgId, route, msgBody) {
    return {
        id: msgId,
        body: msgBody
    };
};
var composePush = function (route, msgBody) {
    var msg = generate.publish(msgBody);
    if (!msg) {
        logger.error('invalid mqtt publish message: %j', msgBody);
    }
    return msg;
};
//# sourceMappingURL=mqttconnector.js.map