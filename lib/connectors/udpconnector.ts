import * as net from 'net';
import * as util from 'util';
import * as dgram from "dgram";
import * as utils from '../util/utils';
import * as Constants from '../util/constants';
import {UdpSocket} from './udpsocket';
import * as Kick from './commands/kick';
import { HandshakeCommand } from './commands/handshake';
import { HeartbeatCommand } from './commands/heartbeat';
import { Package, Message } from 'pomelo-protocol';
import * as coder from './common/coder';
import { EventEmitter } from 'events';
import { getLogger } from 'pomelo-logger';
import { SocketType } from 'dgram';
var logger = getLogger('pomelo', __filename);

var curId = 1;

export class UDPConnector extends EventEmitter
{
    opts: any;
    type: SocketType;
    handshake: HandshakeCommand;
    heartbeat: HeartbeatCommand;
    clients: { [key: string]: any };
    host: string;
    port: number;
    tcpServer : any;
    socket:any;

    constructor(port, host, opts)
    {
        super();
        this.opts = opts || {};
        this.type = opts.udpType || 'udp4';
        this.handshake = new HandshakeCommand(opts);
        if (!opts.heartbeat)
        {
            opts.heartbeat = Constants.TIME.DEFAULT_UDP_HEARTBEAT_TIME;
            opts.timeout = Constants.TIME.DEFAULT_UDP_HEARTBEAT_TIMEOUT;
        }
        this.heartbeat = new HeartbeatCommand(utils.extendsObject(opts, { disconnectOnTimeout: true }));
        this.clients = {};
        this.host = host;
        this.port = port;
    };

    start(cb)
    {
        var self = this;
        this.tcpServer = net.createServer();
        this.socket = dgram.createSocket(this.type, function (msg, peer)
        {
            var key = genKey(peer);
            if (!self.clients[key])
            {
                var udpsocket = new UdpSocket(curId++, self.socket, peer);
                self.clients[key] = udpsocket;

                udpsocket.on('handshake',
                    self.handshake.handle.bind(self.handshake, udpsocket));

                udpsocket.on('heartbeat',
                    self.heartbeat.handle.bind(self.heartbeat, udpsocket));

                udpsocket.on('disconnect',
                    self.heartbeat.clear.bind(self.heartbeat, udpsocket.id));

                udpsocket.on('disconnect', function ()
                {
                    delete self.clients[genKey(udpsocket.peer)];
                });

                udpsocket.on('closing', Kick.handle.bind(null, udpsocket));

                self.emit('connection', udpsocket);
            }
        });

        this.socket.on('message', function (data, peer)
        {
            var socket = self.clients[genKey(peer)];
            if (!!socket)
            {
                socket.emit('package', data);
            }
        });

        this.socket.on('error', function (err)
        {
            logger.error('udp socket encounters with error: %j', err.stack);
            return;
        });

        this.socket.bind(this.port, this.host);
        this.tcpServer.listen(this.port);
        process.nextTick(cb);
    };

    decode = coder.decode;

    encode = coder.encode;

    stop(force, cb)
    {
        this.socket.close();
        process.nextTick(cb);
    };
}

var genKey = function (peer)
{
    return peer.address + ":" + peer.port;
};