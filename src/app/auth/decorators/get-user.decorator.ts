import { UserDocument } from 'src/app/user/schemas/user.schema';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): UserDocument => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
