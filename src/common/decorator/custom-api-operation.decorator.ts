import { ApiOperation } from '@nestjs/swagger';

export function CustomApiOperation(options: {
  operationId?: string;
  summary?: string;
  deprecated?: boolean;
}) {
  return function (target: any, key: any, descriptor: PropertyDescriptor) {
    ApiOperation({
      operationId: options.operationId || key,
      summary: options.summary,
      deprecated: options.deprecated,
    })(target, key, descriptor as any);
    return descriptor;
  };
}
