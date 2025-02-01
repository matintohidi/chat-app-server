import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { ClassConstructor, ClassTransformOptions } from 'class-transformer';

import { CustomSerializerInterceptor } from './interceptors/serializer.interceptor';

export const StandardSerializer = (
  type: ClassConstructor<unknown>,
  options?: ClassTransformOptions,
  serialize?: boolean,
) => {
  return applyDecorators(
    UseInterceptors(new CustomSerializerInterceptor(type, options, serialize)),
  );
};
