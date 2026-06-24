import { Course, CourseCategory, CourseStatus } from '../courses/models/course.interface';
import { Instructor } from '../instructors/models/instructor.interface';

export interface DashboardStat {
  label: string;
  value: string;
  detail: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface DashboardStatusBreakdown {
  status: CourseStatus;
  label: string;
  count: number;
  percentage: number;
}

export interface DashboardCategoryBreakdown {
  category: CourseCategory;
  label: string;
  count: number;
  percentage: number;
}

export interface DashboardInstructorSummary extends Instructor {
  courses: number;
}

export interface DashboardOverview {
  totalCourses: number;
  activeCourses: number;
  draftCourses: number;
  archivedCourses: number;
  totalInstructors: number;
  activeInstructors: number;
  onLeaveInstructors: number;
  totalRevenue: number;
  activeRevenue: number;
  averagePrice: number;
}

export interface DashboardViewModel {
  overview: DashboardOverview;
  stats: DashboardStat[];
  statusBreakdown: DashboardStatusBreakdown[];
  categoryBreakdown: DashboardCategoryBreakdown[];
  recentCourses: Course[];
  topInstructors: DashboardInstructorSummary[];
}
