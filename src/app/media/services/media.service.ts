import { Injectable } from '@nestjs/common';
import { MediaRepository } from 'src/app/media/repositories/media.repository';

@Injectable()
export class MediaService {
  constructor(private mediaRepository: MediaRepository) {}
}
