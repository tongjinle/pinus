import { ConnectionService } from '../common/service/connectionService';
import { IComponent } from '../interfaces/Component';
export declare class ConnectionComponent extends ConnectionService implements IComponent {
    name: string;
    constructor(app: any);
}
