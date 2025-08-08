import { IsEnumField } from 'src/common/decorator/decorators';

// enum values in persian
export enum ErrorCode {
  UserNotFound = 'User not found',
  UserWithThisEmailAlreadyExists = 'User with this email already exists',
  PasswordOrEmailIsNotMatch = 'Password or email is not match',
}

export class ErrorMessages {
  @IsEnumField({ type: ErrorCode })
  errorCode: ErrorCode;
}
