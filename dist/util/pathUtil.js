"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Constants = require("./constants");
/**
 * Get system remote service path
 *
 * @param  {String} role server role: frontend, backend
 * @return {String}      path string if the path exist else null
 */
function getSysRemotePath(role) {
    var p = path.join(__dirname, '/../common/remote/', role);
    return fs.existsSync(p) ? p : null;
}
exports.getSysRemotePath = getSysRemotePath;
;
/**
 * Get user remote service path
 *
 * @param  {String} appBase    application base path
 * @param  {String} serverType server type
 * @return {String}            path string if the path exist else null
 */
function getUserRemotePath(appBase, serverType) {
    var p = path.join(appBase, '/app/servers/', serverType, Constants.DIR.REMOTE);
    return fs.existsSync(p) ? p : null;
}
exports.getUserRemotePath = getUserRemotePath;
;
/**
 * Get user remote cron path
 *
 * @param  {String} appBase    application base path
 * @param  {String} serverType server type
 * @return {String}            path string if the path exist else null
 */
function getCronPath(appBase, serverType) {
    var p = path.join(appBase, '/app/servers/', serverType, Constants.DIR.CRON);
    return fs.existsSync(p) ? p : null;
}
exports.getCronPath = getCronPath;
;
/**
 * List all the subdirectory names of user remote directory
 * which hold the codes for all the server types.
 *
 * @param  {String} appBase application base path
 * @return {Array}         all the subdiretory name under servers/
 */
function listUserRemoteDir(appBase) {
    var base = path.join(appBase, '/app/servers/');
    var files = fs.readdirSync(base);
    return files.filter(function (fn) {
        if (fn.charAt(0) === '.') {
            return false;
        }
        return fs.statSync(path.join(base, fn)).isDirectory();
    });
}
exports.listUserRemoteDir = listUserRemoteDir;
;
/**
 * Compose remote path record
 *
 * @param  {String} namespace  remote path namespace, such as: 'sys', 'user'
 * @param  {String} serverType
 * @param  {String} path       remote service source path
 * @return {Object}            remote path record
 */
function remotePathRecord(namespace, serverType, path) {
    return { namespace: namespace, serverType: serverType, path: path };
}
exports.remotePathRecord = remotePathRecord;
;
/**
 * Get handler path
 *
 * @param  {String} appBase    application base path
 * @param  {String} serverType server type
 * @return {String}            path string if the path exist else null
 */
function getHandlerPath(appBase, serverType) {
    var p = path.join(appBase, '/app/servers/', serverType, Constants.DIR.HANDLER);
    return fs.existsSync(p) ? p : null;
}
exports.getHandlerPath = getHandlerPath;
;
/**
 * Get admin script root path.
 *
 * @param  {String} appBase application base path
 * @return {String}         script path string
 */
function getScriptPath(appBase) {
    return path.join(appBase, Constants.DIR.SCRIPT);
}
exports.getScriptPath = getScriptPath;
;
/**
 * Get logs path.
 *
 * @param  {String} appBase application base path
 * @return {String}         logs path string
 */
function getLogPath(appBase) {
    return path.join(appBase, Constants.DIR.LOG);
}
exports.getLogPath = getLogPath;
;
//# sourceMappingURL=pathUtil.js.map