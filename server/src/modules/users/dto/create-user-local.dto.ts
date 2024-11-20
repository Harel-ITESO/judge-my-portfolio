import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { passwordOptions } from '../model/password-validator-object';

export class CreateUserLocalDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsStrongPassword(passwordOptions)
  password: string;
}
