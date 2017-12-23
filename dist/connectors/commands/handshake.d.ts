/**
 * Process the handshake request.
 *
 * @param {Object} opts option parameters
 *                      opts.handshake(msg, cb(err, resp)) handshake callback. msg is the handshake message from client.
 *                      opts.hearbeat heartbeat interval (level?)
 *                      opts.version required client level
 */
export declare class HandshakeCommand {
    userHandshake: any;
    heartbeatSec: number;
    heartbeat: number;
    checkClient: boolean;
    useDict: boolean;
    useProtobuf: boolean;
    useCrypto: boolean;
    constructor(opts: any);
    handle: (socket: any, msg: any) => void;
}
