import { UserRole } from "src/utils/types";

export class UserEntityDto {
  sub: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  birthDate: Date;
  password:string;
  constructor(partial: Partial<UserEntityDto>) {
    Object.assign(this, partial);
  }
  role: UserRole;
}