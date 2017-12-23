import { ChannelService } from '../common/service/channelService';

export default function(app, opts) {
  var service = new ChannelService(app, opts);
  app.set('channelService', service);
  service.name = '__channel__';
  return service;
};