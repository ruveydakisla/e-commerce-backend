export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  birthDate: Date;
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
  role:string;
}
