import { IsEmail, IsOptional, IsStrongPassword } from 'class-validator';
import { UserRole } from 'src/utils/types';

export class UpdateUserDto {
  @IsOptional()
  name: string;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password is not strong enough, it should have min 8 char, at least 1 upper case, 1 lower case, 1 number and 1 symbol',
    },
  )
  password: string;
  @IsOptional()
  birthdate: Date;
  @IsOptional()
  role: UserRole;
}
