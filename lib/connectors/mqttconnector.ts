import * as util from 'util';
import { EventEmitter } from 'events';
import * as mqtt from 'mqtt';
import * as constants from '../util/constants';
import { MQTTSocket } from './mqttsocket';
import { MqttAdaptor } from './mqtt/mqttadaptor';
import * as generate from './mqtt/generate';
import { getLogger } from 'pomelo-logger'; var logger = getLogger('pomelo', __filename);

var curId = 1;
/**
 * Connector that manager low level connection and protocol bewteen server and client.
 * Develper can provide their own connector to switch the low level prototol, such as tcp or probuf.
 */
export class MQTTConnector extends EventEmitter
{
    port: number;
    host: string;
    opts: any;
    adaptor: MqttAdaptor;
    mqttServer : any;
    constructor(port, host, opts)
    {
        super();
        this.port = port;
        this.host = host;
        this.opts = opts || {};

        this.adaptor = new MqttAdaptor(this.opts);
    };

    /**
     * Start connector to listen the specified port
     */
    start(cb)
    {
        var self = this;
        this.mqttServer = mqtt.createServer();
        this.mqttServer.on('client', function (client)
        {
            client.on('error', function (err)
            {
                client.stream.destroy();
            });

            client.on('close', function ()
            {
                client.stream.destroy();
            });

            client.on('disconnect', function (packet)
            {
                client.stream.destroy();
            });

            if (self.opts.disconnectOnTimeout)
            {
                var timeout = self.opts.timeout * 1000 || constants.TIME.DEFAULT_MQTT_HEARTBEAT_TIMEOUT;
                client.stream.setTimeout(timeout, function ()
                {
                    client.emit('close');
                });
            }

            client.on('connect', function (packet)
            {
                client.connack({ returnCode: 0 });
                var mqttsocket = new MQTTSocket(curId++, client, self.adaptor);
                self.emit('connection', mqttsocket);
            });
        });

        this.mqttServer.listen(this.port);

        process.nextTick(cb);
    };

    stop()
    {
        this.mqttServer.close();
        process.exit(0);
    };


    encode(reqId, route, msgBody)
    {
        if (!!reqId)
        {
            return composeResponse(reqId, route, msgBody);
        } else
        {
            return composePush(route, msgBody);
        }
    };

    close()
    {
        this.mqttServer.close();
    };
}
var composeResponse = function (msgId, route, msgBody)
{
    return {
        id: msgId,
        body: msgBody
    };
};

var composePush = function (route, msgBody)
{
    var msg = generate.publish(msgBody);
    if (!msg)
    {
        logger.error('invalid mqtt publish message: %j', msgBody);
    }

    return msg;
};