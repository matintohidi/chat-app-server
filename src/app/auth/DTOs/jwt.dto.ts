import { IsStringField } from 'src/common/decorators';

export class JwtPayload {
  @IsStringField({ required: true })
  email: string;

  @IsStringField({ required: true })
  sub: string;
}
