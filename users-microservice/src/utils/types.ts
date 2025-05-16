export const USER_PATTERNS = {
  FindAll: 'Users.FindAll',
  FindOne: 'Users.FindOne',
  FindByEmail: 'Users.FindByEmail',
  Create: 'Users.Create',
  Update: 'Users.Update',
  Remove: 'Users.Remove',
};
export enum UserRole {
  SUPER_ADMIN = 0,
  ADMIN = 1,
  SELLER = 2,
  USER = 3,
  GUEST = 4,
}
export type SortOrder = 'asc' | 'desc';

export type PaginationOptions = {
  page: number;
  limit: number;
  sort: string;
  order: SortOrder;
};
