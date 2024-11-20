import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateThirdPartyUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  authenticationProvider: 'google' | 'github';
}
