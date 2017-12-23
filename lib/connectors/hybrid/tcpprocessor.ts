import { EventEmitter } from 'events';
import * as util from 'util';
import * as utils from '../../util/utils';
import { TcpSocket } from  './tcpsocket';

var ST_STARTED = 1;
var ST_CLOSED = 2;

// private protocol, no need exports
var HEAD_SIZE = 4;

/**
 * websocket protocol processor
 */
export class TCPProcessor extends EventEmitter
{
    closeMethod: Function;
    state: number;
    constructor(closeMethod)
    {
        super();
        this.closeMethod = closeMethod;
        this.state = ST_STARTED;
    };
    add = function (socket, data)
    {
        if (this.state !== ST_STARTED)
        {
            return;
        }
        var tcpsocket = new TcpSocket(socket, {
            headSize: HEAD_SIZE,
            headHandler: utils.headHandler,
            closeMethod: this.closeMethod
        });
        this.emit('connection', tcpsocket);
        socket.emit('data', data);
    };

    close = function ()
    {
        if (this.state !== ST_STARTED)
        {
            return;
        }
        this.state = ST_CLOSED;
    };
}