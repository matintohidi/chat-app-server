import { applyDecorators, UsePipes, ValidationPipe } from '@nestjs/common';

export const ValidateDto = () => {
  return applyDecorators(
    UsePipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    ),
  );
};
