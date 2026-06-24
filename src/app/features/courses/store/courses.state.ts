import { AdvancedFilterGroup } from '../../../shared/interfaces/advanced-filter.interface';
import { FilterValues } from '../../../shared/components/filters/filters.interface';
import { TableSort } from '../../../shared/components/table/table.interface';
import { Course } from '../models/course.interface';

export interface CoursesState {
  courses: Course[];
  filters: FilterValues;
  advancedFilters: AdvancedFilterGroup | null;
  sort: TableSort | null;
  loading: boolean;
  error: string | null;
}

export const initialCoursesState: CoursesState = {
  courses: [],
  filters: {},
  advancedFilters: null,
  sort: null,
  loading: false,
  error: null,
};
