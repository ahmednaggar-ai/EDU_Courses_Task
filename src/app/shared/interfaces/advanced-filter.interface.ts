import { SelectOption } from './select-option.interface';

export type AdvancedFilterLogic = 'and' | 'or';

export type AdvancedFilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'greaterThan'
  | 'lessThan';

export type AdvancedFilterFieldType = 'text' | 'number' | 'select';

export interface AdvancedFilterFieldConfig {
  key: string;
  label: string;
  type: AdvancedFilterFieldType;
  options?: SelectOption<string | number | null>[];
}

export interface AdvancedFilterRule {
  field: string;
  operator: AdvancedFilterOperator;
  value: string | number | null;
}

export interface AdvancedFilterGroup {
  logic: AdvancedFilterLogic;
  rules: AdvancedFilterRule[];
}

export interface AdvancedFilterDialogData {
  fields: AdvancedFilterFieldConfig[];
  filters?: AdvancedFilterGroup | null;
}

export interface AdvancedFilterDialogResult {
  filters: AdvancedFilterGroup | null;
}
