import {
  HttpCode,
  HttpStatus,
  Logger,
  RequestMethod,
  Version,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ClassTransformOptions } from 'class-transformer';

import { CustomApiOperation } from './custom-api-operation.decorator';
import { StandardSerializer } from './serializer.decorator';
import { StandardApiResponse } from './standard-api-res.decorator';

interface StandardApiInterface {
  type?: any;
  resTypeOption?: ClassTransformOptions;
  statusCode?: HttpStatus;
  description?: string;
  isArray?: boolean;
  deprecated?: boolean;
  operationId?: string;
  serialize?: boolean;
  summary?: string;
  uploadFile?: boolean;
  isStandard?: boolean;
  ignoreWarning?: boolean;
  version?: number | number[];
  body?: {
    type?: any;
    isArray?: boolean;
  };
}

const logger = new Logger();
export const GlobalHandlerName: string[] = [];

function getMetaData(target: any, propertyKey: string, descriptor: any) {
  return {
    name: propertyKey,
    constructorName: target.constructor.name,
    params: Reflect.getMetadata('design:paramtypes', target, 'getHostSitMap'),
    return: Reflect.getMetadata('design:returntype', target, propertyKey),
    method: Reflect.getMetadata('method', descriptor.value),
  };
}

const getStatusCode = (code) => {
  let statusCode: number;
  switch (code) {
    case [RequestMethod.DELETE, RequestMethod.PUT, RequestMethod.GET].includes(
      code,
    ):
      statusCode = 200;
      break;
    case code === RequestMethod.POST:
      statusCode = 201;
      break;
    default:
      statusCode = 200;
  }

  return statusCode;
};

function defineDecorators(
  params: StandardApiInterface = {},
  target: any,
  propertyKey: any,
  descriptor: any,
): any[] {
  let { statusCode: status, version, isArray, type } = params;

  const {
    description,
    deprecated,
    operationId,
    summary,
    isStandard = true,
    ignoreWarning,
    body,
    resTypeOption,
    serialize,
  } = params;

  isArray = type?.constructor?.name === 'Array';
  type = isArray ? type?.[0] : type;

  const metaData = getMetaData(target, propertyKey, descriptor);

  version ||= 1;
  const convertedVersion =
    typeof version === 'number'
      ? String(version)
      : version.map((i) => String(i));

  let decorators = [
    HttpCode(status),
    Version(convertedVersion),
    CustomApiOperation({
      deprecated,
      operationId,
      summary: summary || '🟣',
    }),
  ];

  if (metaData.method === undefined && ignoreWarning !== false && !status) {
    logger.warn(
      `Use Standard Api upper than Method Decorators ( @GET , @POST , ...) ${metaData.name}-${metaData.constructorName}`,
      'INIT API',
    );
  }
  status ||= getStatusCode(metaData.method);

  if (isStandard !== false && type) {
    decorators = [
      ...decorators,
      StandardSerializer(type, resTypeOption || {}, serialize),
      StandardApiResponse({
        type,
        status,
        description,
        isArray,
      }),
    ];
  }

  if (body?.type) {
    body.isArray ||= body?.type?.constructor?.name === 'Array';
    body.type = body.isArray ? body.type[0] : body.type;

    decorators = [
      ...decorators,
      ApiBody({ type: body?.type, isArray: body?.isArray }),
    ];
  }

  return decorators;
}

export function StandardApi(params?: StandardApiInterface) {
  return (target: any, propertyKey: string, descriptor: any) => {
    const decorators = defineDecorators(
      params,
      target,
      propertyKey,
      descriptor,
    );
    for (const decorator of decorators) {
      if (target instanceof Function && !descriptor) {
        decorator(target);
        continue;
      }
      decorator(target, propertyKey, descriptor);
    }
  };
}
