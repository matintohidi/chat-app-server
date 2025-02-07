import { BusinessController } from 'src/common/decorator/business-controller.decorator';
import { MediaService } from 'src/app/media/services/media.service';

@BusinessController('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}
}
