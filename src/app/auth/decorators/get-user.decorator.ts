import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/app/user/schemas/user.schema';

export const GetUser = createParamDecorator<
  keyof UserDocument | undefined,
  ExecutionContext
>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return typeof data === 'undefined' ? user : user[data];
});

export type GetUser<Prop extends keyof UserDocument | undefined = undefined> =
  Prop extends undefined ? UserDocument : UserDocument[Prop];
