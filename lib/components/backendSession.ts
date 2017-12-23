import { BackendSessionService } from '../common/service/backendSessionService';

export default function(app) {
  var service = new BackendSessionService(app);
  service.name = '__backendSession__';
  // export backend session service to the application context.
  app.set('backendSessionService', service);

  return service;
};
