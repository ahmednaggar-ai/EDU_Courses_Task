export type InstructorStatus = 'Active' | 'On Leave';

export interface Instructor {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: number;
  status: InstructorStatus;
}
