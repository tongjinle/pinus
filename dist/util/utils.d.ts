/// <reference types="node" />
import * as util from 'util';
/**
 * Invoke callback with check
 */
export declare function invokeCallback(cb: any, ...args: any[]): any;
/**
 * Get the count of elements of object
 */
export declare function size(obj: any): number;
/**
 * Check a string whether ends with another string
 */
export declare function endsWith(str: any, suffix: any): boolean;
/**
 * Check a string whether starts with another string
 */
export declare function startsWith(str: any, prefix: any): boolean;
/**
 * Compare the two arrays and return the difference.
 */
export declare function arrayDiff(array1: any, array2: any): any[];
export declare function format(date: any, format?: string): string;
/**
 * check if has Chinese characters.
 */
export declare function hasChineseChar(str: any): boolean;
/**
 * transform unicode to utf8
 */
export declare function unicodeToUtf8(str: any): string;
/**
 * Ping server to check if network is available
 *
 */
export declare function ping(host: any, cb: any): void;
/**
 * Check if server is exsit.
 *
 */
export declare function checkPort(server: any, cb: any): void;
export declare function isLocal(host: any): boolean;
/**
 * Load cluster server.
 *
 */
export declare function loadCluster(app: any, server: any, serverMap: any): void;
export declare function headHandler(headBuffer: any): number;
export declare function isObject(arg: any): boolean;
export declare var promisify: typeof util.promisify;
