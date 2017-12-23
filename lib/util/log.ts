import * as logger from 'pomelo-logger';

/**
 * Configure pomelo logger
 */
export function configure(app, filename) {
  var serverId = app.getServerId();
  var base = app.getBase();
  logger.configure(filename, {serverId: serverId, base: base});
};
