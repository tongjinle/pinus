/**
 * Run all servers
 *
 * @param {Object} app current application  context
 * @return {Void}
 */
export declare function runServers(app: any): void;
/**
 * Run server
 *
 * @param {Object} app current application context
 * @param {Object} server
 * @return {Void}
 */
export declare function run(app: any, server: any, cb: any): void;
/**
 * Bind process with cpu
 *
 * @param {String} sid server id
 * @param {String} pid process id
 * @param {String} host server host
 * @return {Void}
 */
export declare function bindCpu(sid: any, pid: any, host: any): void;
/**
 * Kill application in all servers
 *
 * @param {String} pids  array of server's pid
 * @param {String} serverIds array of serverId
 */
export declare function kill(pids: any, servers: any): void;
/**
 * Use ssh to run command.
 *
 * @param {String} cmd command that would be executed in the remote server
 * @param {String} host remote server host
 * @param {Function} cb callback function
 *
 */
export declare function sshrun(cmd: any, host: any, cb?: Function): void;
/**
 * Run local command.
 *
 * @param {String} cmd
 * @param {Callback} callback
 *
 */
export declare function localrun(cmd: any, host: any, options: any, callback?: Function): void;
