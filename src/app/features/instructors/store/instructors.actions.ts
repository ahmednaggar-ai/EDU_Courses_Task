import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AdvancedFilterGroup } from '../../../shared/interfaces/advanced-filter.interface';
import { FilterValues } from '../../../shared/components/filters/filters.interface';
import { TableSort, TableSortEvent } from '../../../shared/components/table/table.interface';
import { Instructor } from '../models/instructor.interface';
import { InstructorsPagination } from './instructors.state';

export const InstructorsActions = createActionGroup({
  source: 'Instructors',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ instructors: Instructor[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Apply Filters': props<{ filters: FilterValues }>(),
    'Apply Advanced Filters': props<{ advancedFilters: AdvancedFilterGroup | null }>(),
    'Change Page': props<{ pagination: InstructorsPagination }>(),
    'Change Sort': props<{ sort: TableSort | null; event: TableSortEvent }>(),
    'Request Complete': emptyProps(),
    'Add Instructor': props<{ instructor: Instructor }>(),
    'Update Instructor': props<{ instructor: Instructor }>(),
    'Delete Instructor': props<{ id: string }>(),
  },
});
