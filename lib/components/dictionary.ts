import * as fs from 'fs';
import * as path from 'path';
import * as utils from '../util/utils';
import * as Loader from 'pinus-loader';
import * as pathUtil from '../util/pathUtil';
import * as crypto from 'crypto';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';

export class DictionaryComponent implements IComponent
{
    app: Application;
    dict = {};
    abbrs = {};
    userDicPath = null;
    version = "";
    name = '__dictionary__';

    constructor(app, opts)
    {
        this.app = app;

        //Set user dictionary
        var p = path.join(app.getBase(), '/config/dictionary.json');
        if (!!opts && !!opts.dict)
        {
            p = opts.dict;
        }
        if (fs.existsSync(p))
        {
            this.userDicPath = p;
        }
    };

    start(cb)
    {
        var servers = this.app.get('servers');
        var routes = [];

        //Load all the handler files
        for (var serverType in servers)
        {
            var p = pathUtil.getHandlerPath(this.app.getBase(), serverType);
            if (!p)
            {
                continue;
            }

            var handlers = Loader.load(p, this.app);

            for (var name in handlers)
            {
                var handler = handlers[name];
                for (var key in handler)
                {
                    if (typeof (handler[key]) === 'function')
                    {
                        routes.push(serverType + '.' + name + '.' + key);
                    }
                }
            }
        }

        //Sort the route to make sure all the routers abbr are the same in all the servers
        routes.sort();
        var abbr;
        var i;
        for (i = 0; i < routes.length; i++)
        {
            abbr = i + 1;
            this.abbrs[abbr] = routes[i];
            this.dict[routes[i]] = abbr;
        }

        //Load user dictionary
        if (!!this.userDicPath)
        {
            var userDic = require(this.userDicPath);

            abbr = routes.length + 1;
            for (i = 0; i < userDic.length; i++)
            {
                var route = userDic[i];

                this.abbrs[abbr] = route;
                this.dict[route] = abbr;
                abbr++;
            }
        }

        this.version = crypto.createHash('md5').update(JSON.stringify(this.dict)).digest('base64');

        utils.invokeCallback(cb);
    };

    getDict()
    {
        return this.dict;
    };

    getAbbrs()
    {
        return this.abbrs;
    };

    getVersion()
    {
        return this.version;
    };

}