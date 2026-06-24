import { PublicUser, User } from '../../../core/models/user.interface';

export interface AuthState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const initialAuthState: AuthState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  initialized: false,
};

export type AuthUser = PublicUser;
