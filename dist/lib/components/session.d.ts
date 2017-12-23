import { SessionService } from '../common/service/sessionService';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
/**
 * Session component. Manage sessions.
 *
 * @param {Object} app  current application context
 * @param {Object} opts attach parameters
 */
export declare class SessionComponent implements IComponent {
    app: Application;
    service: SessionService;
    constructor(app: Application, opts: any);
    name: string;
}
