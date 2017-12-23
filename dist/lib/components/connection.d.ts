import { ConnectionService } from '../common/service/connectionService';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
export declare class ConnectionComponent implements IComponent {
    app: Application;
    service: ConnectionService;
    name: string;
    constructor(app: any);
}
