import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';

export const StandardApiResponse = ({ type, isArray, description, status }) => {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      description,
      status,
      isArray,
      type,
    }),
  );
};
