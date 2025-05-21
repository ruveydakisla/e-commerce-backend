import { UserRole } from "users/constants";

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
export interface RequestUser {
  role?: UserRole;
  id: number;
}

export interface RequestWithUser extends Request {
  user?: RequestUser;
  params: { id: number };
}
