import { ConnectionService } from '../common/service/connectionService';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';



export class ConnectionComponent implements IComponent
{
    app: Application;
    service: ConnectionService;
    name = '__connection__';

    constructor(app)
    {
        this.app = app;
        this.service = new ConnectionService(app);

        // proxy the service methods except the lifecycle interfaces of component
        var method, self = this;

        var getFun = function (m)
        {
            return (function ()
            {
                return function ()
                {
                    return self.service[m].apply(self.service, arguments);
                };
            })();
        };

        for (var m in this.service)
        {
            if (m !== 'start' && m !== 'stop')
            {
                method = this.service[m];
                if (typeof method === 'function')
                {
                    this[m] = getFun(m);
                }
            }
        }
    };
}