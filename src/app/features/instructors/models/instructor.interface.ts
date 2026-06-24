export type InstructorStatus = 'Active' | 'On Leave';

export interface Instructor {
  id: string;
  name: string;
  email: string;
  department: string;
  status: InstructorStatus;
}

export interface InstructorTableRow extends Instructor {
  courses: number;
}
