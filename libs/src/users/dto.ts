import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { UserRole } from "./constants";

export class CreateUserDto {
  @IsNotEmpty({ message: "Name is required" })
  name: string;
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail()
  email: string;
  @IsNotEmpty()
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
        "Password is not strong enough, it should have min 8 char, at least 1 upper case, 1 lower case, 1 number and 1 symbol",
    }
  )
  password: string;
  @IsOptional()
  birthdate: Date;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Email must be a valid email address" })
  email?: string;

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
        "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol",
    }
  )
  password?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: "Birthdate must be a valid ISO date string (e.g. YYYY-MM-DD)" }
  )
  birthdate?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: "Role must be one of the defined user roles" })
  role?: UserRole;
}
