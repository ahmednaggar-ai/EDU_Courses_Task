export type CourseStatus = 'Active' | 'Draft' | 'Archived';
export type CourseCategory = 'FRONTEND' | 'DESIGN' | 'BACKEND';
export type CourseCategorySeverity = 'info' | 'success' | 'warn';

export interface Course {
  id: string;
  name: string;
  instructor: string;
  category: CourseCategory;
  duration: string;
  price: number;
  status: CourseStatus;
  icon: string;
  iconColor: string;
}
