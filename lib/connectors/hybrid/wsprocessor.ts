import { Server as HttpServer } from 'http';
import { EventEmitter } from 'events';
import * as util from 'util';
import { Server as WebSocketServer } from 'ws';

var ST_STARTED = 1;
var ST_CLOSED = 2;

/**
 * websocket protocol processor
 */
export class WSProcessor extends EventEmitter
{
    httpServer: HttpServer;
    wsServer: WebSocketServer;
    state: number;

    constructor()
    {
        super();
        this.httpServer = new HttpServer();

        var self = this;
        this.wsServer = new WebSocketServer({ server: this.httpServer });

        this.wsServer.on('connection', function (socket)
        {
            // emit socket to outside
            self.emit('connection', socket);
        });

        this.state = ST_STARTED;
    };


    add(socket, data)
    {
        if (this.state !== ST_STARTED)
        {
            return;
        }
        this.httpServer.emit('connection', socket);
        if (typeof socket.ondata === 'function')
        {
            // compatible with stream2
            socket.ondata(data, 0, data.length);
        } else
        {
            // compatible with old stream
            socket.emit('data', data);
        }
    };

    close()
    {
        if (this.state !== ST_STARTED)
        {
            return;
        }
        this.state = ST_CLOSED;
        this.wsServer.close();
        this.wsServer = null;
        this.httpServer = null;
    };
}