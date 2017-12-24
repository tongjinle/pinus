import { BackendSessionService } from '../common/service/backendSessionService';
import { IComponent } from '../interfaces/Component';
import { Application } from '../application';


export class BackendSessionComponent implements IComponent
{
  constructor(app: Application) 
  {
    var service = new BackendSessionService(app);
    // export backend session service to the application context.
    app.set('backendSessionService', service, true);

  };

  name = '__backendSession__';
}
