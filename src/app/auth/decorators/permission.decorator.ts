import { SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthStrategies } from 'src/app/auth/enums/jwt.enum';
import { ApiAccessLevel } from 'src/app/auth/enums/permission.enum';
import { RolesGuard } from 'src/app/auth/role.guard';

interface ApiPermissionParam {
  autoFill?: boolean;
  name?: string;
  groupName?: string;
  authStrategy?: AuthStrategies;
}

export const ApiPermissionMetaDataKey = 'ApiPermissionMetaDataKey';

export function ApiPermission(
  level: ApiAccessLevel[] = [],
  option: ApiPermissionParam = {},
) {
  level = [...level, ApiAccessLevel.ADMIN];

  return function (target: any, key: any, descriptor: any) {
    const actionName = option?.name || key;
    const groupName = option?.groupName || target.constructor.name;

    const actionData: any = { name: actionName, group: { name: groupName } };

    const authStrategy = option?.authStrategy || AuthStrategies.JWT;

    Reflect.defineMetadata(ApiPermissionMetaDataKey, actionData, descriptor);

    ApiBearerAuth()(target, key, descriptor);
    SetMetadata('permission', level)(target, key, descriptor);
    UseGuards(AuthGuard(authStrategy), RolesGuard)(target, key, descriptor);
  };
}
