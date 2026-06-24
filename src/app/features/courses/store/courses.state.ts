import { Course } from '../models/course.interface';
import { FilterValues } from '../../../shared/components/filters/filters.interface';

export interface CoursesState {
  courses: Course[];
  filters: FilterValues;
  loading: boolean;
  error: string | null;
}

export const initialCoursesState: CoursesState = {
  courses: [],
  filters: {},
  loading: false,
  error: null,
};
