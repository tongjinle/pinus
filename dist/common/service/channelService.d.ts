import { ChannelRemote } from '../remote/frontend/channelRemote';
import { Application } from '../../application';
/**
 * Create and maintain channels for server local.
 *
 * ChannelService is created by channel component which is a default loaded
 * component of pomelo and channel service would be accessed by `app.get('channelService')`.
 *
 * @class
 * @constructor
 */
export declare class ChannelService {
    app: Application;
    channels: {
        [key: string]: Channel;
    };
    prefix: string;
    store: any;
    broadcastFilter: any;
    channelRemote: ChannelRemote;
    name: string;
    constructor(app: any, opts: any);
    start(cb: any): void;
    /**
     * Create channel with name.
     *
     * @param {String} name channel's name
     * @memberOf ChannelService
     */
    createChannel(name: any): Channel;
    /**
     * Get channel by name.
     *
     * @param {String} name channel's name
     * @param {Boolean} create if true, create channel
     * @return {Channel}
     * @memberOf ChannelService
     */
    getChannel(name: any, create: any): Channel;
    /**
     * Destroy channel by name.
     *
     * @param {String} name channel name
     * @memberOf ChannelService
     */
    destroyChannel(name: any): void;
    /**
     * Push message by uids.
     * Group the uids by group. ignore any uid if sid not specified.
     *
     * @param {String} route message route
     * @param {Object} msg message that would be sent to client
     * @param {Array} uids the receiver info list, [{uid: userId, sid: frontendServerId}]
     * @param {Object} opts user-defined push options, optional
     * @param {Function} cb cb(err)
     * @memberOf ChannelService
     */
    pushMessageByUids(route: any, msg: any, uids: any, opts: any, cb: any): void;
    /**
     * Broadcast message to all the connected clients.
     *
     * @param  {String}   stype      frontend server type string
     * @param  {String}   route      route string
     * @param  {Object}   msg        message
     * @param  {Object}   opts       user-defined broadcast options, optional
     *                               opts.binded: push to binded sessions or all the sessions
     *                               opts.filterParam: parameters for broadcast filter.
     * @param  {Function} cb         callback
     * @memberOf ChannelService
     */
    broadcast(stype: any, route: any, msg: any, opts: any, cb: any): void;
    apushMessageByUids: Function;
    abroadcast: Function;
}
/**
 * Channel maintains the receiver collection for a subject. You can
 * add users into a channel and then broadcast message to them by channel.
 *
 * @class channel
 * @constructor
 */
export declare class Channel {
    name: string;
    groups: {
        [sid: number]: string;
    };
    records: {
        [key: string]: {
            sid: string;
            uid: string;
        };
    };
    __channelService__: ChannelService;
    state: number;
    userAmount: number;
    constructor(name: any, service: any);
    /**
     * Add user to channel.
     *
     * @param {Number} uid user id
     * @param {String} sid frontend server id which user has connected to
     */
    add(uid: string, sid: string): boolean;
    /**
     * Remove user from channel.
     *
     * @param {Number} uid user id
     * @param {String} sid frontend server id which user has connected to.
     * @return [Boolean] true if success or false if fail
     */
    leave(uid: string, sid: string): boolean;
    /**
     * Get channel UserAmount in a channel.
    
     *
     * @return {number } channel member amount
     */
    getUserAmount(): number;
    /**
     * Get channel members.
     *
     * <b>Notice:</b> Heavy operation.
     *
     * @return {Array} channel member uid list
     */
    getMembers(): any[];
    /**
     * Get Member info.
     *
     * @param  {String} uid user id
     * @return {Object} member info
     */
    getMember(uid: any): {
        sid: string;
        uid: string;
    };
    /**
     * Destroy channel.
     */
    destroy(): void;
    /**
     * Push message to all the members in the channel
     *
     * @param {String} route message route
     * @param {Object} msg message that would be sent to client
     * @param {Object} opts user-defined push options, optional
     * @param {Function} cb callback function
     */
    pushMessage(route: any, msg: any, opts: any, cb: any): void;
    apushMessage: Function;
}
