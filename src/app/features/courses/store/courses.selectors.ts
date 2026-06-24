import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FilterValues } from '../../../shared/components/filters/filters.interface';
import { applyAdvancedFilters } from '../../../shared/utils/advanced-filter.util';
import { sortItems } from '../../../shared/utils/sort.util';
import { Course } from '../models/course.interface';
import { CoursesState } from './courses.state';

export const selectCoursesState = createFeatureSelector<CoursesState>('courses');

export const selectAllCourses = createSelector(
  selectCoursesState,
  (state) => state.courses,
);

export const selectCoursesFilters = createSelector(
  selectCoursesState,
  (state) => state.filters,
);

export const selectCoursesAdvancedFilters = createSelector(
  selectCoursesState,
  (state) => state.advancedFilters,
);

export const selectCoursesSort = createSelector(
  selectCoursesState,
  (state) => state.sort,
);

export const selectCoursesLoading = createSelector(
  selectCoursesState,
  (state) => state.loading,
);

export const selectCoursesError = createSelector(
  selectCoursesState,
  (state) => state.error,
);

function filterCourses(courses: Course[], values: FilterValues): Course[] {
  const search = String(values['search'] ?? '')
    .trim()
    .toLowerCase();

  return courses.filter((course) => {
    if (values['status'] && course.status !== values['status']) {
      return false;
    }

    if (values['category'] && course.category !== values['category']) {
      return false;
    }

    if (search) {
      const haystack = `${course.name} ${course.instructor} ${course.id}`.toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }

    return true;
  });
}

export const selectFilteredCourses = createSelector(
  selectAllCourses,
  selectCoursesFilters,
  selectCoursesAdvancedFilters,
  (courses, filters, advancedFilters) =>
    applyAdvancedFilters(filterCourses(courses, filters), advancedFilters),
);

export const selectSortedFilteredCourses = createSelector(
  selectFilteredCourses,
  selectCoursesSort,
  (courses, sort) => sortItems(courses, sort),
);
