import {Promise} from "bluebird"
// 使用bluebird输出完整的promise调用链
global.Promise = Promise;
// 开启长堆栈
Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true
});
// 支持注解
import "reflect-metadata";
import { pomelo } from 'pomelo';

// 自动解析ts的sourcemap
require('source-map-support').install({
    handleUncaughtExceptions: false
});
  
// 捕获普通异常
process.on('uncaughtException', function (err)
{
    console.error('Caught exception: ' + err.stack);
});

// 捕获async异常
process.on('unhandledRejection', (reason, p) => {
    console.error('Caught Unhandled Rejection at:' + p + 'reason:' + reason.stack);
  });
  
  
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', '$');

// app configuration
app.configure('production|development', 'connector', function ()
{
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 3,
            useDict: true,
            useProtobuf: true
        });
});

// start app
app.start();

