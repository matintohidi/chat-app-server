import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { isArray, isEmpty } from 'lodash';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomSerializerInterceptor implements NestInterceptor {
  type: any;
  customOptions?: ClassTransformOptions;
  serialize: boolean;
  TypeOfData = 'type';

  private defaultOptions: ClassTransformOptions = {
    enableCircularCheck: true, // circle check fot nested class
    strategy: 'excludeAll', // default strategy to strip all field expect exposed property
    excludeExtraneousValues: true, // strip unexposed property
    enableImplicitConversion: true, // check type
  };

  constructor(
    type: ClassConstructor<unknown>,
    options?: ClassTransformOptions,
    serialize?: boolean,
  ) {
    this.type = type;
    this.customOptions = options;
    this.serialize = serialize ?? true;
  }

  private serializeResponse(
    type: ClassConstructor<unknown>,
    payload: any | any[],
    options: ClassTransformOptions,
  ): any | any[] {
    // To convert ObjectId to string
    if (Array.isArray(payload)) {
      payload.map((item) => {
        Object.keys(item).forEach((key) => {
          if (item[key] instanceof Types.ObjectId) {
            item[key] = item[key].toString();
          }
        });
      });
    } else {
      Object.keys(payload).forEach((key) => {
        if (payload[key] instanceof Types.ObjectId) {
          payload[key] = payload[key].toString();
        }
      });
    }

    let data = plainToInstance(type, payload, {
      ...options,
    });

    if (isArray(data)) {
      data = data.filter((item) => !isEmpty(item));
    }

    return data;
  }

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data: any) => {
        data = await data;

        if (!data) {
          throw new NotFoundException();
        }

        if (this.serialize) {
          return this.serializeResponse(this.type, data, {
            ...this.defaultOptions,
            ...this.customOptions,
          });
        }

        return data;
      }),
    );
  }
}
