import { Instructor } from '../../models/instructor.interface';

export interface InstructorFormDialogData {
  instructor?: Instructor;
}

export interface InstructorFormDialogResult {
  instructor: Instructor;
}
