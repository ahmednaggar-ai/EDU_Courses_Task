import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FilterValues } from '../../../shared/components/filters/filters.interface';
import { applyAdvancedFilters } from '../../../shared/utils/advanced-filter.util';
import { sortItems } from '../../../shared/utils/sort.util';
import { selectAllCourses } from '../../courses/store/courses.selectors';
import { Instructor, InstructorTableRow } from '../models/instructor.interface';
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

export const selectInstructorsAdvancedFilters = createSelector(
  selectInstructorsState,
  (state) => state.advancedFilters,
);

export const selectInstructorsSort = createSelector(
  selectInstructorsState,
  (state) => state.sort,
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

function withCourseCounts(instructors: Instructor[], courses: { instructor: string }[]): InstructorTableRow[] {
  return instructors.map((instructor) => ({
    ...instructor,
    courses: courses.filter((course) => course.instructor === instructor.name).length,
  }));
}

export const selectFilteredInstructors = createSelector(
  selectAllInstructors,
  selectInstructorsFilters,
  selectInstructorsAdvancedFilters,
  (instructors, filters, advancedFilters) =>
    applyAdvancedFilters(filterInstructors(instructors, filters), advancedFilters),
);

export const selectFilteredInstructorsWithCourseCount = createSelector(
  selectFilteredInstructors,
  selectAllCourses,
  (instructors, courses) => withCourseCounts(instructors, courses),
);

export const selectSortedFilteredInstructorsWithCourseCount = createSelector(
  selectFilteredInstructorsWithCourseCount,
  selectInstructorsSort,
  (instructors, sort) => sortItems(instructors, sort),
);

export const selectFilteredInstructorsCount = createSelector(
  selectSortedFilteredInstructorsWithCourseCount,
  (instructors) => instructors.length,
);

export const selectInstructorsPage = createSelector(
  selectSortedFilteredInstructorsWithCourseCount,
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
