import { ChannelService } from '../common/service/channelService';
import { IComponent } from '../interfaces/Component';
import { Application } from '../application';

export class ChannelComponent implements IComponent
{
  constructor(app: Application, opts)
  {
    var service = new ChannelService(app, opts);
    app.set('channelService', service, true);
  };
  name = '__channel__';
}