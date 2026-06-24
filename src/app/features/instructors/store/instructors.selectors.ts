import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FilterValues } from '../../../shared/components/filters/filters.interface';
import { Instructor } from '../models/instructor.interface';
import { InstructorsState } from './instructors.state';

export const selectInstructorsState = createFeatureSelector<InstructorsState>('instructors');

export const selectAllInstructors = createSelector(
  selectInstructorsState,
  (state) => state.instructors,
);

export const selectInstructorsFilters = createSelector(
  selectInstructorsState,
  (state) => state.filters,
);

export const selectInstructorsPagination = createSelector(
  selectInstructorsState,
  (state) => state.pagination,
);

export const selectInstructorsLoading = createSelector(
  selectInstructorsState,
  (state) => state.loading,
);

export const selectInstructorsError = createSelector(
  selectInstructorsState,
  (state) => state.error,
);

function filterInstructors(instructors: Instructor[], values: FilterValues): Instructor[] {
  const search = String(values['search'] ?? '')
    .trim()
    .toLowerCase();

  return instructors.filter((instructor) => {
    if (values['department'] && instructor.department !== values['department']) {
      return false;
    }

    if (values['status'] && instructor.status !== values['status']) {
      return false;
    }

    if (search) {
      const haystack =
        `${instructor.name} ${instructor.email} ${instructor.id}`.toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }

    return true;
  });
}

export const selectFilteredInstructors = createSelector(
  selectAllInstructors,
  selectInstructorsFilters,
  (instructors, filters) => filterInstructors(instructors, filters),
);

export const selectFilteredInstructorsCount = createSelector(
  selectFilteredInstructors,
  (instructors) => instructors.length,
);

export const selectInstructorsPage = createSelector(
  selectFilteredInstructors,
  selectInstructorsPagination,
  (instructors, { first, rows }) => instructors.slice(first, first + rows),
);

export const selectInstructorDepartments = createSelector(
  selectAllInstructors,
  (instructors) => {
    const departments = [...new Set(instructors.map((instructor) => instructor.department))];
    return departments.sort();
  },
);
