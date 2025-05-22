import { UserRole } from '@my/common';

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
