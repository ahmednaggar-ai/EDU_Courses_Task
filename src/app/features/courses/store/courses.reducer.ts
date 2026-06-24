import { createReducer, on } from '@ngrx/store';
import { CoursesActions } from './courses.actions';
import { initialCoursesState } from './courses.state';

export const coursesReducer = createReducer(
  initialCoursesState,
  on(CoursesActions.load, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CoursesActions.loadSuccess, (state, { courses }) => ({
    ...state,
    courses,
    loading: false,
    error: null,
  })),
  on(CoursesActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CoursesActions.applyFilters, (state, { filters }) => ({
    ...state,
    filters,
    loading: true,
    error: null,
  })),
  on(CoursesActions.applyFiltersComplete, (state) => ({
    ...state,
    loading: false,
  })),
);
