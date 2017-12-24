import { BackendSessionService } from '../common/service/backendSessionService';
import { IComponent } from '../interfaces/Component';
import { Application } from '../application';
export declare class BackendSessionComponent extends BackendSessionService implements IComponent {
    constructor(app: Application);
    name: string;
}
