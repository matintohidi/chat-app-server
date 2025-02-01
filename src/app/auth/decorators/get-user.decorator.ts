import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { createParamDecorator } from '@nestjs/common';
import { UserModel } from 'src/app/user/DTOs/user.dto';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): UserModel => {
    const req = ctx.switchToHttp().getRequest();
    // console.log(req);
    return req.user;
  },
);
