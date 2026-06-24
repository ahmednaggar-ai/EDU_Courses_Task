import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs';
import {
  selectAuthInitialized,
  selectIsAuthenticated,
} from '../../features/auth/store/auth.selectors';

export const authGuard: CanActivateFn = (): ReturnType<CanActivateFn> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthInitialized).pipe(
    filter((initialized) => initialized),
    take(1),
    switchMap(() => store.select(selectIsAuthenticated).pipe(take(1))),
    map((isAuthenticated): boolean | UrlTree =>
      isAuthenticated ? true : router.createUrlTree(['/auth/sign-in']),
    ),
  );
};

export const guestGuard: CanActivateFn = (): ReturnType<CanActivateFn> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthInitialized).pipe(
    filter((initialized) => initialized),
    take(1),
    switchMap(() => store.select(selectIsAuthenticated).pipe(take(1))),
    map((isAuthenticated): boolean | UrlTree =>
      isAuthenticated ? router.createUrlTree(['/dashboard']) : true,
    ),
  );
};
