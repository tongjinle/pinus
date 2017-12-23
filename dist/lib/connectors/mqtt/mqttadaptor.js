"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MqttAdaptor {
    constructor(opts) {
        this.subReqs = {};
        opts = opts || {};
        this.publishRoute = opts.publishRoute;
        this.subscribeRoute = opts.subscribeRoute;
    }
    ;
    onPublish(client, packet) {
        var route = this.publishRoute;
        if (!route) {
            throw new Error('unspecified publish route.');
        }
        var payload = packet.payload;
        if (payload instanceof Buffer) {
            payload = payload.toString('utf8');
        }
        var req = {
            id: packet.messageId,
            route: route,
            body: packet
        };
        client.emit('message', req);
        if (packet.qos === 1) {
            client.socket.puback({ messageId: packet.messageId });
        }
    }
    ;
    onSubscribe(client, packet) {
        var route = this.subscribeRoute;
        if (!route) {
            throw new Error('unspecified subscribe route.');
        }
        var req = {
            id: packet.messageId,
            route: route,
            body: {
                subscriptions: packet.subscriptions
            }
        };
        this.subReqs[packet.messageId] = packet;
        client.emit('message', req);
    }
    ;
    onPubAck(client, packet) {
        var req = {
            id: packet.messageId,
            route: 'connector.mqttHandler.pubAck',
            body: {
                mid: packet.messageId
            }
        };
        this.subReqs[packet.messageId] = packet;
        client.emit('message', req);
    }
    ;
    /**
     * Publish message or subscription ack.
     *
     * if packet.id exist and this.subReqs[packet.id] exist then packet is a suback.
     * Subscription is request/response mode.
     * packet.id is pass from client in packet.messageId and record in Pomelo context and attached to the subscribe response packet.
     * packet.body is the context that returned by subscribe next callback.
     *
     * if packet.id not exist then packet is a publish message.
     *
     * otherwise packet is a illegal packet.
     */
    publish(client, packet) {
        var mid = packet.id;
        var subreq = this.subReqs[mid];
        if (subreq) {
            // is suback
            client.socket.suback({ messageId: mid, granted: packet.body });
            delete this.subReqs[mid];
            return;
        }
        client.socket.publish(packet.body);
    }
    ;
}
exports.MqttAdaptor = MqttAdaptor;
//# sourceMappingURL=mqttadaptor.js.map