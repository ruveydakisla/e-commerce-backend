import { UserRole } from '@my/common/src/users/constants';

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
