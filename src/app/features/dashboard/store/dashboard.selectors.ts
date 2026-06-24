import { createSelector } from '@ngrx/store';
import { CourseCategory, CourseStatus } from '../../courses/models/course.interface';
import { selectAllCourses, selectCoursesLoading } from '../../courses/store/courses.selectors';
import { selectAllInstructors, selectInstructorsLoading } from '../../instructors/store/instructors.selectors';
import {
  DashboardCategoryBreakdown,
  DashboardInstructorSummary,
  DashboardOverview,
  DashboardStat,
  DashboardStatusBreakdown,
  DashboardViewModel,
} from '../dashboard.interface';

const CATEGORY_LABELS: Record<CourseCategory, string> = {
  FRONTEND: 'Frontend',
  DESIGN: 'Design',
  BACKEND: 'Backend',
};

const STATUS_LABELS: Record<CourseStatus, string> = {
  Active: 'Active',
  Draft: 'Draft',
  Archived: 'Archived',
};

export const selectDashboardOverview = createSelector(
  selectAllCourses,
  selectAllInstructors,
  (courses, instructors): DashboardOverview => {
    const activeCourses = courses.filter((course) => course.status === 'Active');
    const draftCourses = courses.filter((course) => course.status === 'Draft');
    const archivedCourses = courses.filter((course) => course.status === 'Archived');
    const totalRevenue = courses.reduce((sum, course) => sum + course.price, 0);
    const activeRevenue = activeCourses.reduce((sum, course) => sum + course.price, 0);

    return {
      totalCourses: courses.length,
      activeCourses: activeCourses.length,
      draftCourses: draftCourses.length,
      archivedCourses: archivedCourses.length,
      totalInstructors: instructors.length,
      activeInstructors: instructors.filter((instructor) => instructor.status === 'Active').length,
      onLeaveInstructors: instructors.filter((instructor) => instructor.status === 'On Leave').length,
      totalRevenue,
      activeRevenue,
      averagePrice: courses.length ? totalRevenue / courses.length : 0,
    };
  },
);

export const selectDashboardStats = createSelector(
  selectDashboardOverview,
  (overview): DashboardStat[] => [
    {
      label: 'Total Courses',
      value: String(overview.totalCourses),
      detail: `${overview.activeCourses} active`,
      icon: 'pi pi-book',
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
    },
    {
      label: 'Active Courses',
      value: String(overview.activeCourses),
      detail: `${overview.draftCourses} draft, ${overview.archivedCourses} archived`,
      icon: 'pi pi-check-circle',
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
    },
    {
      label: 'Total Instructors',
      value: String(overview.totalInstructors),
      detail: `${overview.activeInstructors} active, ${overview.onLeaveInstructors} on leave`,
      icon: 'pi pi-users',
      iconBg: '#ede9fe',
      iconColor: '#7c3aed',
    },
    {
      label: 'Catalog Revenue',
      value: formatCurrency(overview.totalRevenue),
      detail: `${formatCurrency(overview.activeRevenue)} from active courses`,
      icon: 'pi pi-wallet',
      iconBg: '#fef3c7',
      iconColor: '#d97706',
    },
  ],
);

export const selectDashboardStatusBreakdown = createSelector(
  selectAllCourses,
  (courses): DashboardStatusBreakdown[] => {
    const statuses: CourseStatus[] = ['Active', 'Draft', 'Archived'];
    const total = courses.length || 1;

    return statuses.map((status) => {
      const count = courses.filter((course) => course.status === status).length;

      return {
        status,
        label: STATUS_LABELS[status],
        count,
        percentage: Math.round((count / total) * 100),
      };
    });
  },
);

export const selectDashboardCategoryBreakdown = createSelector(
  selectAllCourses,
  (courses): DashboardCategoryBreakdown[] => {
    const categories: CourseCategory[] = ['FRONTEND', 'DESIGN', 'BACKEND'];
    const total = courses.length || 1;

    return categories.map((category) => {
      const count = courses.filter((course) => course.category === category).length;

      return {
        category,
        label: CATEGORY_LABELS[category],
        count,
        percentage: Math.round((count / total) * 100),
      };
    });
  },
);

export const selectDashboardRecentCourses = createSelector(selectAllCourses, (courses) =>
  [...courses].sort((left, right) => right.createdDate.localeCompare(left.createdDate)).slice(0, 5),
);

export const selectDashboardTopInstructors = createSelector(
  selectAllCourses,
  selectAllInstructors,
  (courses, instructors): DashboardInstructorSummary[] =>
    instructors
      .map((instructor) => ({
        ...instructor,
        courses: courses.filter((course) => course.instructor === instructor.name).length,
      }))
      .sort((left, right) => right.courses - left.courses)
      .slice(0, 5),
);

export const selectDashboardViewModel = createSelector(
  selectDashboardOverview,
  selectDashboardStats,
  selectDashboardStatusBreakdown,
  selectDashboardCategoryBreakdown,
  selectDashboardRecentCourses,
  selectDashboardTopInstructors,
  (
    overview,
    stats,
    statusBreakdown,
    categoryBreakdown,
    recentCourses,
    topInstructors,
  ): DashboardViewModel => ({
    overview,
    stats,
    statusBreakdown,
    categoryBreakdown,
    recentCourses,
    topInstructors,
  }),
);

export const selectDashboardLoading = createSelector(
  selectCoursesLoading,
  selectInstructorsLoading,
  (coursesLoading, instructorsLoading) => coursesLoading || instructorsLoading,
);

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
