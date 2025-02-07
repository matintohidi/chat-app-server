import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiAccessLevel } from 'src/app/auth/enums/permission.enum';
import { UserModel } from 'src/app/user/dto/user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions: ApiAccessLevel[] = this.reflector.get(
      'permission',
      context.getHandler(),
    );

    if (!permissions) {
      return true;
    }

    if (permissions.includes(ApiAccessLevel.ALL)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user: UserModel = request.user;

    if (!permissions.includes(user.accessLevel as any)) {
      throw new ForbiddenException('access level is not correct');
    }

    return true;
  }
}
