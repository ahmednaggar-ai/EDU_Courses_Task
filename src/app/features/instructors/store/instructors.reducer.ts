import { createReducer, on } from '@ngrx/store';
import { InstructorsActions } from './instructors.actions';
import { initialInstructorsState } from './instructors.state';

export const instructorsReducer = createReducer(
  initialInstructorsState,
  on(InstructorsActions.load, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(InstructorsActions.loadSuccess, (state, { instructors }) => ({
    ...state,
    instructors,
    loading: false,
    error: null,
  })),
  on(InstructorsActions.loadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(InstructorsActions.applyFilters, (state, { filters }) => ({
    ...state,
    filters,
    pagination: { ...state.pagination, first: 0 },
    loading: true,
    error: null,
  })),
  on(InstructorsActions.changePage, (state, { pagination }) => ({
    ...state,
    pagination,
    loading: true,
    error: null,
  })),
  on(InstructorsActions.requestComplete, (state) => ({
    ...state,
    loading: false,
  })),
);
