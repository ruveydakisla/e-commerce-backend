import { UserRole } from '../utils/types';

export class User {
  id: number;
  role: UserRole;
  email: string;
  password: string;
}
