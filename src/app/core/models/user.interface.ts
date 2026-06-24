import { SignUpRoleValue } from '../../features/auth/pages/sign-up/sign-up.interface';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: SignUpRoleValue;
  roleLabel: string;
  avatarUrl: string;
}

export type PublicUser = Omit<User, 'password'>;

export interface AuthSessionCredentials {
  email: string;
  password: string;
}

export interface StoredAuthSession extends AuthSessionCredentials {
  rememberMe: boolean;
}
