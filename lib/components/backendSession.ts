import { BackendSessionService } from '../common/service/backendSessionService';

export default function(app) {
  var service = new BackendSessionService(app);
  service.name = '__backendSession__';
  // export backend session service to the application context.
  app.set('backendSessionService', service, true);

  // for compatibility as `LocalSession` is renamed to `BackendSession` 
  app.set('localSessionService', service, true);

  return service;
};
