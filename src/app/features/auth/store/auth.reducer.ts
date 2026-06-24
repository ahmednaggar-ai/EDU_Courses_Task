import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.init, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null,
  })),
  on(AuthActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    initialized: true,
  })),
  on(AuthActions.sessionRestored, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    error: null,
    initialized: true,
  })),
  on(AuthActions.initializationComplete, (state) => ({
    ...state,
    loading: false,
    initialized: true,
  })),
  on(AuthActions.signIn, AuthActions.signUp, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.signInSuccess, AuthActions.signUpSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    error: null,
    initialized: true,
  })),
  on(AuthActions.signInFailure, AuthActions.signUpFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    initialized: true,
  })),
  on(AuthActions.signOut, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.signOutSuccess, (state) => ({
    ...state,
    currentUser: null,
    loading: false,
    error: null,
    initialized: true,
  })),
);
