/**
 * Get system remote service path
 *
 * @param  {String} role server role: frontend, backend
 * @return {String}      path string if the path exist else null
 */
export declare function getSysRemotePath(role: any): string;
/**
 * Get user remote service path
 *
 * @param  {String} appBase    application base path
 * @param  {String} serverType server type
 * @return {String}            path string if the path exist else null
 */
export declare function getUserRemotePath(appBase: any, serverType: any): string;
/**
 * Get user remote cron path
 *
 * @param  {String} appBase    application base path
 * @param  {String} serverType server type
 * @return {String}            path string if the path exist else null
 */
export declare function getCronPath(appBase: any, serverType: any): string;
/**
 * List all the subdirectory names of user remote directory
 * which hold the codes for all the server types.
 *
 * @param  {String} appBase application base path
 * @return {Array}         all the subdiretory name under servers/
 */
export declare function listUserRemoteDir(appBase: any): string[];
/**
 * Compose remote path record
 *
 * @param  {String} namespace  remote path namespace, such as: 'sys', 'user'
 * @param  {String} serverType
 * @param  {String} path       remote service source path
 * @return {Object}            remote path record
 */
export declare function remotePathRecord(namespace: any, serverType: any, path: any): {
    namespace: any;
    serverType: any;
    path: any;
};
/**
 * Get handler path
 *
 * @param  {String} appBase    application base path
 * @param  {String} serverType server type
 * @return {String}            path string if the path exist else null
 */
export declare function getHandlerPath(appBase: any, serverType: any): string;
/**
 * Get admin script root path.
 *
 * @param  {String} appBase application base path
 * @return {String}         script path string
 */
export declare function getScriptPath(appBase: any): string;
/**
 * Get logs path.
 *
 * @param  {String} appBase application base path
 * @return {String}         logs path string
 */
export declare function getLogPath(appBase: any): string;
