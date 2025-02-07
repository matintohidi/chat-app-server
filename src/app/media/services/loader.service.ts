import { Injectable } from '@nestjs/common';
import { Media } from 'src/app/media/schemas/media.schema';
import { API_URL, NODE_ENV } from 'src/configs/app.config';

@Injectable()
export class MediaLoaderService {
  urlHandler(relativeUrl: string) {
    let urlPrefix = `${API_URL}/media/download`;

    if (NODE_ENV !== 'production') {
      urlPrefix = `http://localhost:1337/media/download`;
    }

    if (relativeUrl?.[0] !== '/') {
      relativeUrl = `/${relativeUrl}`;
    }

    return urlPrefix + relativeUrl;
  }

  baseUrlHandler(media: Media) {
    const relativeUrl = media.relativeUrl;

    const url = this.urlHandler(relativeUrl);

    media.url = url;
  }
}
