import { Instructor } from '../models/instructor.interface';
import { FilterValues } from '../../../shared/components/filters/filters.interface';

export interface InstructorsPagination {
  first: number;
  rows: number;
}

export interface InstructorsState {
  instructors: Instructor[];
  filters: FilterValues;
  pagination: InstructorsPagination;
  loading: boolean;
  error: string | null;
}

export const initialInstructorsState: InstructorsState = {
  instructors: [],
  filters: {},
  pagination: { first: 0, rows: 10 },
  loading: false,
  error: null,
};
