import { IsStringField } from 'src/common/decorator/decorators';

export class JwtPayload {
  @IsStringField({ required: true })
  email: string;

  @IsStringField({ required: true })
  sub: string;
}
