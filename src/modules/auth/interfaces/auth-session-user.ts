export interface AuthSessionUser {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  tokenId: string;
}
