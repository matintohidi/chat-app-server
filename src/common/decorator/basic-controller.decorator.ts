import {
  applyDecorators,
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateDto } from './validate-dto.decorator';

export const BasicController = (route: string, name?: string) => {
  return applyDecorators(
    ApiBearerAuth(),
    UseInterceptors(ClassSerializerInterceptor),
    ApiTags(name || route),
    ValidateDto(),
    Controller(route),
  );
};
