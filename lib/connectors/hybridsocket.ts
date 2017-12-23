import * as util from 'util';
import { EventEmitter } from 'events';
import {default as  handler } from './common/handler';
import { Package} from 'pomelo-protocol';
import { getLogger } from 'pomelo-logger';
var logger = getLogger('pomelo', __filename);

var ST_INITED = 0;
var ST_WAIT_ACK = 1;
var ST_WORKING = 2;
var ST_CLOSED = 3;

/**
 * Socket class that wraps socket and websocket to provide unified interface for up level.
 */
export class HybridSocket extends EventEmitter
{
    id: string;
    socket: any;
    remoteAddress: { ip: string, port: number };
    state: number;

    constructor(id, socket)
    {
        super();
        this.id = id;
        this.socket = socket;

        if (!socket._socket)
        {
            this.remoteAddress = {
                ip: socket.address().address,
                port: socket.address().port
            };
        } else
        {
            this.remoteAddress = {
                ip: socket._socket.remoteAddress,
                port: socket._socket.remotePort
            };
        }

        var self = this;

        socket.once('close', this.emit.bind(this, 'disconnect'));
        socket.on('error', this.emit.bind(this, 'error'));

        socket.on('message', function (msg)
        {
            if (msg)
            {
                msg = Package.decode(msg);
                handler(self, msg);
            }
        });

        this.state = ST_INITED;

        // TODO: any other events?
    };


    /**
     * Send raw byte data.
     *
     * @api private
     */
    sendRaw = function (msg)
    {
        if (this.state !== ST_WORKING)
        {
            return;
        }
        var self = this;

        this.socket.send(msg, { binary: true }, function (err)
        {
            if (!!err)
            {
                logger.error('websocket send binary data failed: %j', err.stack);
                return;
            }
        });
    };

    /**
     * Send byte data package to client.
     *
     * @param  {Buffer} msg byte data
     */
    send = function (msg)
    {
        if (msg instanceof String)
        {
            msg = new Buffer(msg as string);
        } else if (!(msg instanceof Buffer))
        {
            msg = new Buffer(JSON.stringify(msg));
        }
        this.sendRaw(Package.encode(Package.TYPE_DATA, msg));
    };

    /**
     * Send byte data packages to client in batch.
     *
     * @param  {Buffer} msgs byte data
     */
    sendBatch = function (msgs)
    {
        var rs = [];
        for (var i = 0; i < msgs.length; i++)
        {
            var src = Package.encode(Package.TYPE_DATA, msgs[i]);
            rs.push(src);
        }
        this.sendRaw(Buffer.concat(rs));
    };

    /**
     * Send message to client no matter whether handshake.
     *
     * @api private
     */
    sendForce = function (msg)
    {
        if (this.state === ST_CLOSED)
        {
            return;
        }
        this.socket.send(msg, { binary: true });
    };

    /**
     * Response handshake request
     *
     * @api private
     */
    handshakeResponse = function (resp)
    {
        if (this.state !== ST_INITED)
        {
            return;
        }

        this.socket.send(resp, { binary: true });
        this.state = ST_WAIT_ACK;
    };

    /**
     * Close the connection.
     *
     * @api private
     */
    disconnect = function ()
    {
        if (this.state === ST_CLOSED)
        {
            return;
        }

        this.state = ST_CLOSED;
        this.socket.emit('close');
        this.socket.close();
    };
}