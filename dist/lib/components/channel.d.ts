import { ChannelService } from '../common/service/channelService';
import { IComponent } from '../interfaces/Component';
import { Application } from '../application';
export declare class ChannelComponent extends ChannelService implements IComponent {
    constructor(app: Application, opts: any);
    name: string;
}
