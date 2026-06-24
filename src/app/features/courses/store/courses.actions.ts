import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AdvancedFilterGroup } from '../../../shared/interfaces/advanced-filter.interface';
import { FilterValues } from '../../../shared/components/filters/filters.interface';
import { TableSort, TableSortEvent } from '../../../shared/components/table/table.interface';
import { Course } from '../models/course.interface';

export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ courses: Course[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Apply Filters': props<{ filters: FilterValues }>(),
    'Apply Filters Complete': emptyProps(),
    'Apply Advanced Filters': props<{ advancedFilters: AdvancedFilterGroup | null }>(),
    'Change Sort': props<{ sort: TableSort | null; event: TableSortEvent }>(),
    'Add Course': props<{ course: Course }>(),
    'Update Course': props<{ course: Course }>(),
    'Delete Course': props<{ id: string }>(),
  },
});
