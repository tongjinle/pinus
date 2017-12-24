import { SessionService } from '../common/service/sessionService';
import { Application } from '../application';
import { IComponent } from '../interfaces/Component';


/**
 * Session component. Manage sessions.
 *
 * @param {Object} app  current application context
 * @param {Object} opts attach parameters
 */
export class SessionComponent extends SessionService implements IComponent
{
    app: Application;
    constructor(app: Application, opts)
    {
        super(opts);
        this.app = app;
        app.set('sessionService', this);
    };

    name = '__session__';

}