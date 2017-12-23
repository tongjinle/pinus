/**
 * connection statistics service
 * record connection, login count and list
 */
export declare class ConnectionService {
    serverId: string;
    connCount: number;
    loginedCount: number;
    logined: {};
    constructor(app: any);
    /**
     * Add logined user.
     *
     * @param uid {String} user id
     * @param info {Object} record for logined user
     */
    addLoginedUser: (uid: any, info: any) => void;
    /**
     * Update user info.
     * @param uid {String} user id
     * @param info {Object} info for update.
     */
    updateUserInfo: (uid: any, info: any) => void;
    /**
     * Increase connection count
     */
    increaseConnectionCount: () => void;
    /**
     * Remote logined user
     *
     * @param uid {String} user id
     */
    removeLoginedUser: (uid: any) => void;
    /**
     * Decrease connection count
     *
     * @param uid {String} uid
     */
    decreaseConnectionCount: (uid: any) => void;
    /**
     * Get statistics info
     *
     * @return {Object} statistics info
     */
    getStatisticsInfo: () => {
        serverId: any;
        totalConnCount: any;
        loginedCount: any;
        loginedList: any[];
    };
}
