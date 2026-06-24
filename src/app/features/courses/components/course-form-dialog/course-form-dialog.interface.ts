import { Course } from '../../models/course.interface';

export interface CourseFormDialogData {
  course?: Course;
}

export interface CourseFormDialogResult {
  course: Course;
}
