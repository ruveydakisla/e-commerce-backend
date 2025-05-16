import { UserRole } from 'src/utils/types';

export class UserResponseDto {
  sub: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  birthDate: Date;
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
  role: UserRole;
}

export class UserDto {
  sub: number;
  email: string;
  password: string;
  role:UserRole
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
