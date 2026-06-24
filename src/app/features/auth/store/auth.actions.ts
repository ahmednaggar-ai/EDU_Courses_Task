import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../core/models/user.interface';
import { SignUpRoleValue } from '../pages/sign-up/sign-up.interface';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Init: emptyProps(),
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),
    'Restore Session': emptyProps(),
    'Session Restored': props<{ user: User }>(),
    'Initialization Complete': emptyProps(),
    'Sign In': props<{ email: string; password: string; rememberMe: boolean }>(),
    'Sign In Success': props<{ user: User }>(),
    'Sign In Failure': props<{ error: string }>(),
    'Sign Up': props<{
      fullName: string;
      email: string;
      password: string;
      role: SignUpRoleValue;
    }>(),
    'Sign Up Success': props<{ user: User }>(),
    'Sign Up Failure': props<{ error: string }>(),
    'Sign Out': emptyProps(),
    'Sign Out Success': emptyProps(),
  },
});
