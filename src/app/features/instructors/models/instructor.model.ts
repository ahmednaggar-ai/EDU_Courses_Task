export interface Instructor {
  id: string;
  name: string;
  email: string;
  department: string;
  courses: number;
  status: 'Active' | 'On Leave';
}
