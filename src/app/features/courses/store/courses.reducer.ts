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
  on(CoursesActions.applyAdvancedFilters, (state, { advancedFilters }) => ({
    ...state,
    advancedFilters,
    loading: true,
    error: null,
  })),
  on(CoursesActions.changeSort, (state, { sort }) => ({
    ...state,
    sort,
  })),
  on(CoursesActions.addCourse, (state, { course }) => ({
    ...state,
    courses: [...state.courses, course],
  })),
  on(CoursesActions.updateCourse, (state, { course }) => ({
    ...state,
    courses: state.courses.map((item) => (item.id === course.id ? course : item)),
  })),
  on(CoursesActions.deleteCourse, (state, { id }) => ({
    ...state,
    courses: state.courses.filter((item) => item.id !== id),
  })),
);
