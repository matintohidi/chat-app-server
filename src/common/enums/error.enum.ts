import { IsEnumField } from 'src/common/decorators';

// enum values in persian
export enum ErrorCode {
  UserWithThisEmailOrPhoneNumberAlreadyExists = 'کاربری با این ایمیل یا شماره تلفن قبلا ثبت شده است',
  PasswordIsNotMatch = 'رمز عبور اشتباه است',
}

export class ErrorMessages {
  @IsEnumField({ type: ErrorCode })
  errorCode: ErrorCode;
}
