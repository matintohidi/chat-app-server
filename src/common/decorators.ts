import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EnsureIsArray } from 'src/lib/utils';

function getPropMetaData(
  params: { type?: any; isArray?: boolean; [k: string]: any },
  target: any,
  propertyKey: string,
): { propertyType: any; type: any; isArray: boolean } {
  const propertyType = Reflect.getMetadata('design:type', target, propertyKey);

  const isArray = params?.isArray || propertyType?.name === 'Array';
  const type = params?.type || propertyType;

  return { propertyType, type, isArray };
}

export function IsNumberField(params?: {
  type?: any;
  isArray?: boolean;
  required?: boolean;
}) {
  return function (target: any, propertyKey: string) {
    params ||= {};
    params.required = params.required ?? false;

    const { isArray } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ type: Number, required: params.required, isArray })(
      target,
      propertyKey,
    );
    IsNumber({}, { each: isArray })(target, propertyKey);
    Type(() => Number)(target, propertyKey);
    Expose()(target, propertyKey);

    if (!params?.required) {
      IsOptional()(target, propertyKey);
    }
  };
}
const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);

export function IsBooleanField(params?: {
  type?: any;
  isArray?: boolean;
  required?: boolean;
}) {
  return function (target: any, propertyKey: string) {
    params ||= {};
    params.required = params.required ?? false;
    const { isArray } = getPropMetaData(params, target, propertyKey);

    Expose()(target, propertyKey);
    ApiProperty({ type: Boolean, required: params.required, isArray })(
      target,
      propertyKey,
    );
    IsBoolean({ each: isArray })(target, propertyKey);
    Transform(({ value }) => {
      if (typeof value === 'string') {
        return optionalBooleanMapper.get(value);
      } else {
        return value;
      }
    })(target, propertyKey);

    if (!params?.required) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function IsDateField(params?: {
  type?: any;
  isArray?: boolean;
  required?: boolean;
}) {
  return function (target: any, propertyKey: string) {
    params ||= {};
    params.required = params.required ?? false;
    const { isArray } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ type: Date, required: params.required, isArray })(
      target,
      propertyKey,
    );
    IsDate({ each: isArray })(target, propertyKey);
    Type(() => Date)(target, propertyKey);
    Expose()(target, propertyKey);

    if (!params?.required) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function IsEnumField(params: {
  type: any;
  isArray?: boolean;
  required?: boolean;
}) {
  return function (target: any, propertyKey: string): void {
    const { isArray, type } = getPropMetaData(params, target, propertyKey);

    params ||= { type };
    params.required = params.required ?? false;

    ApiProperty({
      enum: type,
      type: 'string',
      required: params.required,
      isArray,
    })(target, propertyKey);
    Transform(({ value }) => {
      if (isArray) {
        return EnsureIsArray(value);
      } else {
        return value;
      }
    })(target, propertyKey);
    Expose()(target, propertyKey);

    IsOptional()(target, propertyKey);
  };
}

export function IsStringField(params?: {
  type?: any;
  isArray?: boolean;
  required?: boolean;
}) {
  return function (target: any, propertyKey: string): void {
    params ||= {};
    params.required = params.required ?? false;
    const { isArray } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ type: String, required: params.required, isArray })(
      target,
      propertyKey,
    );
    IsString({ each: isArray })(target, propertyKey);
    Type(() => String)(target, propertyKey);
    Expose()(target, propertyKey);

    if (!params?.required) {
      IsOptional()(target, propertyKey);
    }
  };
}
