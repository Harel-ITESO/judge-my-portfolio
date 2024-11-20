import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { CreateUserLocalDto } from 'src/modules/users/dto/create-user-local.dto';
import { passwordOptions } from 'src/modules/users/model/password-validator-object';

export class LocalRegisterDto extends CreateUserLocalDto {
  @IsStrongPassword(passwordOptions)
  @IsNotEmpty()
  doubleCheckPassword: string;
}
