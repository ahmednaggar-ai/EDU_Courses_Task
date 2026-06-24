import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FilterValues } from '../../../shared/components/filters/filters.interface';
import { Instructor } from '../models/instructor.interface';
import { InstructorsPagination } from './instructors.state';

export const InstructorsActions = createActionGroup({
  source: 'Instructors',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ instructors: Instructor[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Apply Filters': props<{ filters: FilterValues }>(),
    'Change Page': props<{ pagination: InstructorsPagination }>(),
    'Request Complete': emptyProps(),
  },
});
