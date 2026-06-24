import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { DataService } from '../../../core/services/data.service';
import { User } from '../../../core/models/user.interface';
import { ToastService } from '../../../shared/services/toast.service';
import { SignUpRoleValue } from '../pages/sign-up/sign-up.interface';
import { AuthActions } from './auth.actions';
import { selectAllUsers } from './auth.selectors';

const ROLE_LABELS: Record<SignUpRoleValue, string> = {
  dean: 'Dean / Academic Director',
  head: 'Department Head',
  registrar: 'Registrar',
  'it-admin': 'IT Administrator',
};

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly toast = inject(ToastService);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      map(() => AuthActions.loadUsers()),
    ),
  );

  loadUsersSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUsersSuccess),
      take(1),
      map(() => AuthActions.restoreSession()),
    ),
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUsers),
      switchMap(() =>
        this.dataService.getUsers().pipe(
          map((users) => {
            const registeredUsers = this.authStorage.getRegisteredUsers();
            const mergedUsers = this.mergeUsers(users, registeredUsers);
            return AuthActions.loadUsersSuccess({ users: mergedUsers });
          }),
          catchError(() =>
            of(AuthActions.loadUsersFailure({ error: 'Failed to load user accounts.' })),
          ),
        ),
      ),
    ),
  );

  loadUsersFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUsersFailure),
      map(() => AuthActions.initializationComplete()),
    ),
  );

  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession),
      withLatestFrom(this.store.select(selectAllUsers)),
      map(([, users]) => {
        const session = this.authStorage.readSession();

        if (!session) {
          return AuthActions.initializationComplete();
        }

        const user = users.find(
          (item) =>
            item.email.toLowerCase() === session.email.toLowerCase() &&
            item.password === session.password,
        );

        if (!user) {
          this.authStorage.clearSession();
          return AuthActions.initializationComplete();
        }

        return AuthActions.sessionRestored({ user });
      }),
    ),
  );

  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),
      withLatestFrom(this.store.select(selectAllUsers)),
      exhaustMap(([{ email, password, rememberMe }, users]) => {
        const user = users.find(
          (item) =>
            item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
        );

        if (!user) {
          return of(
            AuthActions.signInFailure({
              error: 'Invalid email or password. Please check your credentials.',
            }),
          );
        }

        if (rememberMe) {
          this.authStorage.saveSession({ email: user.email, password, rememberMe: true });
        } else {
          this.authStorage.clearSession();
        }

        return of(AuthActions.signInSuccess({ user }));
      }),
    ),
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      withLatestFrom(this.store.select(selectAllUsers)),
      exhaustMap(([{ fullName, email, password, role }, users]) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
          return of(
            AuthActions.signUpFailure({
              error: 'An account with this email already exists.',
            }),
          );
        }

        const user: User = {
          id: `USR-${String(Date.now()).slice(-6)}`,
          name: fullName.trim(),
          email: email.trim(),
          password,
          role,
          roleLabel: ROLE_LABELS[role],
          avatarUrl: `https://i.pravatar.cc/80?u=${encodeURIComponent(normalizedEmail)}`,
        };

        this.authStorage.addRegisteredUser(user);
        this.authStorage.saveSession({
          email: user.email,
          password,
          rememberMe: true,
        });

        return of(
          AuthActions.loadUsersSuccess({
            users: [...users, user],
          }),
          AuthActions.signUpSuccess({ user }),
        );
      }),
    ),
  );

  signInSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        tap(({ user }) => {
          this.toast.success('Signed in successfully', {
            message: `Welcome back, ${user.name}.`,
          });
          void this.router.navigate(['/dashboard']);
        }),
      ),
    { dispatch: false },
  );

  signInFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInFailure),
        tap(({ error }) => {
          if (error) {
            this.toast.error('Sign in failed', { message: error });
          }
        }),
      ),
    { dispatch: false },
  );

  signUpSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signUpSuccess),
        tap(({ user }) => {
          this.toast.success('Account created', {
            message: `${user.name}, your account is ready.`,
          });
          void this.router.navigate(['/dashboard']);
        }),
      ),
    { dispatch: false },
  );

  signUpFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signUpFailure),
        tap(({ error }) => {
          this.toast.error('Sign up failed', { message: error });
        }),
      ),
    { dispatch: false },
  );

  signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signOut),
      switchMap(() => {
        this.authStorage.clearSession();
        return of(AuthActions.signOutSuccess());
      }),
    ),
  );

  signOutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signOutSuccess),
        tap(() => {
          this.toast.info('Signed out', { message: 'You have been logged out successfully.' });
          void this.router.navigate(['/auth/sign-in']);
        }),
      ),
    { dispatch: false },
  );

  private mergeUsers(seedUsers: User[], registeredUsers: User[]): User[] {
    const merged = [...seedUsers];

    for (const user of registeredUsers) {
      if (!merged.some((item) => item.email.toLowerCase() === user.email.toLowerCase())) {
        merged.push(user);
      }
    }

    return merged;
  }
}
