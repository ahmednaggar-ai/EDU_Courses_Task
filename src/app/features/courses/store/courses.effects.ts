import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { CoursesActions } from './courses.actions';

@Injectable()
export class CoursesEffects {
  private readonly actions$ = inject(Actions);
  private readonly dataService = inject(DataService);

  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.load),
      switchMap(() =>
        timer(800).pipe(
          switchMap(() =>
            this.dataService.getCourses().pipe(
              map((courses) => CoursesActions.loadSuccess({ courses })),
              catchError(() =>
                of(CoursesActions.loadFailure({ error: 'Failed to load courses.' })),
              ),
            ),
          ),
        ),
      ),
    ),
  );

  applyFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CoursesActions.applyFilters),
      switchMap(() =>
        timer(800).pipe(map(() => CoursesActions.applyFiltersComplete())),
      ),
    ),
  );
}
