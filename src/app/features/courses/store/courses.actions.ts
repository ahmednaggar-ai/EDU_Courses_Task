import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FilterValues } from '../../../shared/components/filters/filters.interface';
import { Course } from '../models/course.interface';

export const CoursesActions = createActionGroup({
  source: 'Courses',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ courses: Course[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Apply Filters': props<{ filters: FilterValues }>(),
    'Apply Filters Complete': emptyProps(),
    'Add Course': props<{ course: Course }>(),
    'Update Course': props<{ course: Course }>(),
    'Delete Course': props<{ id: string }>(),
  },
});
