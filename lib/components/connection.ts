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
    };
}