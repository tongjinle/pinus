import { SessionService } from '../common/service/sessionService';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';
export default function (app: any, opts: any): SessionComponent;
/**
 * Session component. Manage sessions.
 *
 * @param {Object} app  current application context
 * @param {Object} opts attach parameters
 */
export declare class SessionComponent implements IComponent {
    app: Application;
    service: SessionService;
    constructor(app: any, opts: any);
    name: string;
}
