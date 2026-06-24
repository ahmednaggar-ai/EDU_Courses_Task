import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PublicUser } from '../../../core/models/user.interface';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAllUsers = createSelector(selectAuthState, (state) => state.users);

export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectAuthInitialized = createSelector(
  selectAuthState,
  (state) => state.initialized,
);

export const selectCurrentUser = createSelector(selectAuthState, (state): PublicUser | null => {
  if (!state.currentUser) {
    return null;
  }

  const { password: _password, ...user } = state.currentUser;
  return user;
});

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => !!state.currentUser,
);

export function selectUserByCredentials(email: string, password: string) {
  return createSelector(selectAllUsers, (users) =>
    users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
    ),
  );
}
