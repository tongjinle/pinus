"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const utils = require("../util/utils");
const Loader = require("pomelo-loader");
const pathUtil = require("../util/pathUtil");
const crypto = require("crypto");
function default_1(app, opts) {
    return new DictionaryComponent(app, opts);
}
exports.default = default_1;
;
class DictionaryComponent {
    constructor(app, opts) {
        this.dict = {};
        this.abbrs = {};
        this.userDicPath = null;
        this.version = "";
        this.name = '__dictionary__';
        this.start = function (cb) {
            var servers = this.app.get('servers');
            var routes = [];
            //Load all the handler files
            for (var serverType in servers) {
                var p = pathUtil.getHandlerPath(this.app.getBase(), serverType);
                if (!p) {
                    continue;
                }
                var handlers = Loader.load(p, this.app);
                for (var name in handlers) {
                    var handler = handlers[name];
                    for (var key in handler) {
                        if (typeof (handler[key]) === 'function') {
                            routes.push(serverType + '.' + name + '.' + key);
                        }
                    }
                }
            }
            //Sort the route to make sure all the routers abbr are the same in all the servers
            routes.sort();
            var abbr;
            var i;
            for (i = 0; i < routes.length; i++) {
                abbr = i + 1;
                this.abbrs[abbr] = routes[i];
                this.dict[routes[i]] = abbr;
            }
            //Load user dictionary
            if (!!this.userDicPath) {
                var userDic = require(this.userDicPath);
                abbr = routes.length + 1;
                for (i = 0; i < userDic.length; i++) {
                    var route = userDic[i];
                    this.abbrs[abbr] = route;
                    this.dict[route] = abbr;
                    abbr++;
                }
            }
            this.version = crypto.createHash('md5').update(JSON.stringify(this.dict)).digest('base64');
            utils.invokeCallback(cb);
        };
        this.getDict = function () {
            return this.dict;
        };
        this.getAbbrs = function () {
            return this.abbrs;
        };
        this.getVersion = function () {
            return this.version;
        };
        this.app = app;
        //Set user dictionary
        var p = path.join(app.getBase(), '/config/dictionary.json');
        if (!!opts && !!opts.dict) {
            p = opts.dict;
        }
        if (fs.existsSync(p)) {
            this.userDicPath = p;
        }
    }
    ;
}
exports.DictionaryComponent = DictionaryComponent;
//# sourceMappingURL=dictionary.js.map