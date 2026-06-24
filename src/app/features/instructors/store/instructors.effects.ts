import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { DataService } from '../../../core/services/data.service';
import { InstructorsActions } from './instructors.actions';

@Injectable()
export class InstructorsEffects {
  private readonly actions$ = inject(Actions);
  private readonly dataService = inject(DataService);

  loadInstructors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstructorsActions.load),
      switchMap(() =>
        timer(800).pipe(
          switchMap(() =>
            this.dataService.getInstructors().pipe(
              map((instructors) => InstructorsActions.loadSuccess({ instructors })),
              catchError(() =>
                of(InstructorsActions.loadFailure({ error: 'Failed to load instructors.' })),
              ),
            ),
          ),
        ),
      ),
    ),
  );

  applyFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstructorsActions.applyFilters, InstructorsActions.applyAdvancedFilters),
      switchMap(() =>
        timer(600).pipe(map(() => InstructorsActions.requestComplete())),
      ),
    ),
  );

  changePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InstructorsActions.changePage, InstructorsActions.changeSort),
      switchMap(() =>
        timer(600).pipe(map(() => InstructorsActions.requestComplete())),
      ),
    ),
  );
}
