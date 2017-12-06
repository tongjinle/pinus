
/**
 * ChannelService
 * Create and maintain channels for server local.
 * ChannelService is created by channel component which is a default loaded component of pomelo and channel service would be accessed by app.get('channelService').
 */
export declare interface ChannelService
{

	/**
	 * Create channel with name.
	 *
	 * @param {string} name channel's name
	 * @return {Channel}
	 */
	createChannel(name: string): Channel;

	/**
	 * Get channel by name.
	 *
	 * @param {string} name channel's name
	 * @param {boolean} create if true, create channel
	 * @return {Channel}
	 */
	getChannel(name: string, create: boolean): Channel;

	/**
	 * Destroy channel by name.
	 *
	 * @param {string} name channel name
	 */
	destroyChannel(name: string): void;

	/**
	 * Push message by uids.
	 * Group the uids by group. ignore any uid if sid not specified.
	 *
	 * @param {string} route message route
	 * @param {Object} msg message that would be sent to client
	 * @param {Array} uids the receiver info list, [{uid: userId, sid: frontendServerId}]
	 * @param {Object} opts user-defined push options, optional 
	 * @param {Function} cb cb(err)
	 */
	pushMessageByUids(route: string, msg: any, uids: {uid:string,sid:string}[], opts?: Object, cb?: (err: Error) => void): void;
	apushMessageByUids(route: string, msg: any, uids: {uid:string,sid:string}[], opts?: Object): Promise<void>;

	/**
	 * Broadcast message to all the connected clients.
	 *
	 * @param  {string}   stype      frontend server type string
	 * @param  {string}   route      route string
	 * @param  {Object}   msg        message
	 * @param  {Object}   opts       user-defined broadcast options, optional
	 *                               opts.binded: push to binded sessions or all the sessions
	 *                               opts.filterParam: parameters for broadcast filter.
	 * @param  {Function} cb         callback
	 */
	broadcast(stype: string, route: string, msg: any, opts?: Object, cb?: Function): void;
	abroadcast(stype: string, route: string, msg: any, opts?: Object): Promise<void>;
}

/**
 * Channel
 * Channel maintains the receiver collection for a subject. You can add users into a channel and then broadcast message to them by channel.
 */
export declare interface Channel
{
	/**
	 * Add user to channel.
	 *
	 * @param {string} uid user id
	 * @param {string} sid frontend server id which user has connected to
	 * @return {boolean} true if success or false if fail
	 */
	add(uid: string, sid: string): boolean;

	/**
	 * Remove user from channel.
	 *
	 * @param {string} uid user id
	 * @param {string} sid frontend server id which user has connected to.
	 * @return [boolean] true if success or false if fail
	 */
	leave(uid: string, sid: string): boolean;

	/**
	 * Get channel members.
	 *
	 * <b>Notice:</b> Heavy operation.
	 *
	 * @return {Array} channel member uid list
	 */
    getMembers(): { sid: string, uid: string }[];

	/**
	 * Get Member info.
	 *
	 * @param  {string} uid user id
	 * @return {Object} member info
	 */
    getMember(uid: string): { sid: string, uid: string};

	/**
	 * Destroy channel.
	 */
	destroy(): void;

	/**
	 * Push message to all the members in the channel
	 *
	 * @param {string} route message route
	 * @param {Object} msg message that would be sent to client
	 * @param {Object} opts user-defined push options, optional
	 * @param {Function} cb callback function
	 */
	pushMessage(route: string, msg: Object, opts?: Object, cb?: Function): void;
	apushMessage(route: string, msg: Object, opts?: Object): Promise<void>;

	/**
	 * Push message to all the members in the channel
	 *
	 * @param {Object} msg message that would be sent to client
	 * @param {Object} opts user-defined push options, optional
	 * @param {Function} cb callback function
	 */
	pushMessage(msg: Object, opts?: Object, cb?: Function): void;
	apushMessage(msg: Object, opts?: Object): Promise<void>;

	// 频道名字
	readonly name: string;
	// 频道里的用户数量
	readonly userAmount: number;
	// 所属的频道服务
	readonly __channelService__: ChannelService;
}
