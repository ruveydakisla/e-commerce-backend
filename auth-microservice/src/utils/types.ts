export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole;
};

export enum UserRole {
  SUPER_ADMIN = 0,
  ADMIN = 1,
  SELLER = 2,
  USER = 3,
  GUEST = 4,
}
