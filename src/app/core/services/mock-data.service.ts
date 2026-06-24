import { Injectable } from '@angular/core';
import { CourseCategory, CourseStatus } from '../../features/courses/models/course.interface';
import { InstructorStatus } from '../../features/instructors/models/instructor.interface';
import {
  CourseCategoryFilterOption,
  CourseCategorySeverityMap,
  CourseStatusFilterOption,
} from '../../features/courses/pages/courses-list/courses-list.interface';
import { SelectOption } from '../../shared/interfaces/select-option.interface';

export interface CourseIconOption extends SelectOption<string> {
  previewColor?: string;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private readonly courseStatuses: CourseStatusFilterOption[] = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Archived', value: 'Archived' },
  ];

  private readonly courseCategories: CourseCategoryFilterOption[] = [
    { label: 'All Categories', value: null },
    { label: 'Frontend', value: 'FRONTEND' },
    { label: 'Design', value: 'DESIGN' },
    { label: 'Backend', value: 'BACKEND' },
  ];

  private readonly categorySeverityMap: CourseCategorySeverityMap = {
    FRONTEND: 'info',
    DESIGN: 'success',
    BACKEND: 'warn',
  };

  private readonly instructorStatuses: SelectOption<InstructorStatus | null>[] = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'On Leave', value: 'On Leave' },
  ];

  private readonly courseDurations: SelectOption<string>[] = Array.from({ length: 12 }, (_, index) => {
    const weeks = index + 1;
    const label = weeks === 1 ? '1 Week' : `${weeks} Weeks`;

    return { label, value: label };
  });

  private readonly courseIcons: CourseIconOption[] = [
    { label: 'Code', value: 'pi pi-code', previewColor: '#2563eb' },
    { label: 'Palette', value: 'pi pi-palette', previewColor: '#0ea5e9' },
    { label: 'Server', value: 'pi pi-server', previewColor: '#6366f1' },
    { label: 'Database', value: 'pi pi-database', previewColor: '#6366f1' },
    { label: 'Book', value: 'pi pi-book', previewColor: '#16a34a' },
    { label: 'Chart', value: 'pi pi-chart-line', previewColor: '#d97706' },
    { label: 'Users', value: 'pi pi-users', previewColor: '#7c3aed' },
  ];

  getCourseStatuses(): CourseStatusFilterOption[] {
    return this.courseStatuses;
  }

  getCourseCategories(): CourseCategoryFilterOption[] {
    return this.courseCategories;
  }

  getCategorySeverityMap(): CourseCategorySeverityMap {
    return this.categorySeverityMap;
  }

  getInstructorStatuses(): SelectOption<InstructorStatus | null>[] {
    return this.instructorStatuses;
  }

  getCourseStatusFormOptions(): SelectOption<CourseStatus>[] {
    return this.courseStatuses.filter((option): option is SelectOption<CourseStatus> => option.value !== null);
  }

  getCourseCategoryFormOptions(): SelectOption<CourseCategory>[] {
    return this.courseCategories.filter(
      (option): option is SelectOption<CourseCategory> => option.value !== null,
    );
  }

  getInstructorStatusFormOptions(): SelectOption<InstructorStatus>[] {
    return this.instructorStatuses.filter(
      (option): option is SelectOption<InstructorStatus> => option.value !== null,
    );
  }

  getCourseDurationOptions(): SelectOption<string>[] {
    return this.courseDurations;
  }

  getCourseIconOptions(): CourseIconOption[] {
    return this.courseIcons;
  }
}
