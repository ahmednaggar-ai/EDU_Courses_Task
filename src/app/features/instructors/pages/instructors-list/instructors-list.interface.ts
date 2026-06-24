import { InstructorStatus } from '../../models/instructor.interface';
import { SelectOption } from '../../../../shared/interfaces/select-option.interface';

export type InstructorDepartmentFilterOption = SelectOption<string | null>;
export type InstructorStatusFilterOption = SelectOption<InstructorStatus | null>;
export type InstructorStatusSeverity = 'success' | 'warn';
