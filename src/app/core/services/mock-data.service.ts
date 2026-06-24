import { Injectable } from '@angular/core';
import { CourseCategory, CourseStatus } from '../../features/courses/models/course.interface';
import { InstructorStatus } from '../../features/instructors/models/instructor.interface';
import {
  CourseCategoryFilterOption,
  CourseCategorySeverityMap,
  CourseStatusFilterOption,
} from '../../features/courses/pages/courses-list/courses-list.interface';
import { SelectOption } from '../../shared/interfaces/select-option.interface';

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
}
