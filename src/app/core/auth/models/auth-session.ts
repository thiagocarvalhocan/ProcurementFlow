import { AuthenticatedUser } from './authenticated-user';

export interface AuthSession {
  token: string;
  user: AuthenticatedUser;
  issuedAt: number;
  expiresAt: number;
}
