import * as logger from 'pinus-logger';

/**
 * Configure pinus logger
 */
export function configure(app, filename) {
  var serverId = app.getServerId();
  var base = app.getBase();
  logger.configure(filename, {serverId: serverId, base: base});
};
