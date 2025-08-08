import { IsStringField } from 'src/common/decorator/decorators';

export class JwtPayload {
  @IsStringField()
  email: string;

  @IsStringField()
  sub: string;
}
