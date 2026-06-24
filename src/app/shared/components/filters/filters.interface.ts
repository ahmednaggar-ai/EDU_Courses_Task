import { SelectOption } from '../../interfaces/select-option.interface';

export type FilterFieldType = 'text' | 'select' | 'datepicker';

export interface FilterFieldConfig {
  key: string;
  type: FilterFieldType;
  placeholder?: string;
  label?: string;
  options?: SelectOption<string | number | null>[];
  dateFormat?: string;
}

export interface FilterConfig {
  fields: FilterFieldConfig[];
  showClearButton?: boolean;
  debounceMs?: number;
}

export type FilterValues = Record<string, unknown>;

export type FilterChangeHandler = (values: FilterValues) => void;
