import { AdvancedFilterGroup } from '../../../shared/interfaces/advanced-filter.interface';
import { FilterValues } from '../../../shared/components/filters/filters.interface';
import { TableSort } from '../../../shared/components/table/table.interface';
import { Instructor } from '../models/instructor.interface';

export interface InstructorsPagination {
  first: number;
  rows: number;
}

export interface InstructorsState {
  instructors: Instructor[];
  filters: FilterValues;
  advancedFilters: AdvancedFilterGroup | null;
  sort: TableSort | null;
  pagination: InstructorsPagination;
  loading: boolean;
  error: string | null;
}

export const initialInstructorsState: InstructorsState = {
  instructors: [],
  filters: {},
  advancedFilters: null,
  sort: null,
  pagination: { first: 0, rows: 10 },
  loading: false,
  error: null,
};
