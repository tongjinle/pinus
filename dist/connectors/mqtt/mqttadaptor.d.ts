export declare class MqttAdaptor {
    subReqs: {};
    publishRoute: any;
    subscribeRoute: any;
    constructor(opts: any);
    onPublish(client: any, packet: any): void;
    onSubscribe(client: any, packet: any): void;
    onPubAck(client: any, packet: any): void;
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
    publish(client: any, packet: any): void;
}
