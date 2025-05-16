import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty({ message: 'Name is required' })
    name:string;
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    email:string;
    @IsNotEmpty()
    @IsStrongPassword({
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 1,
    },{message:'Password is not strong enough, it should have min 8 char, at least 1 upper case, 1 lower case, 1 number and 1 symbol'})
    password:string;
    @IsOptional()
    birthdate:Date
}