import { CourseCategory, CourseCategorySeverity, CourseStatus } from '../../models/course.interface';
import { SelectOption } from '../../../../shared/interfaces/select-option.interface';

export interface CourseStat {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean | null;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export type CourseStatusFilterOption = SelectOption<CourseStatus | null>;
export type CourseCategoryFilterOption = SelectOption<CourseCategory | null>;

export type CourseCategorySeverityMap = Record<CourseCategory, CourseCategorySeverity>;
