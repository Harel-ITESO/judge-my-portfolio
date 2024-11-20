import { IsEmail, IsNotEmpty } from 'class-validator';

export class ThirdPartyAuthDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  authenticationProvider: 'google' | 'github';
}
