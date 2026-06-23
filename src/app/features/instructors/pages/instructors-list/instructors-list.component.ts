import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Instructor } from '../../models/instructor.model';

@Component({
  selector: 'app-instructors-list',
  imports: [FormsModule, Button, Select, TableModule, Tag],
  templateUrl: './instructors-list.component.html',
  styleUrl: './instructors-list.component.scss',
})
export class InstructorsListComponent {
  protected selectedDepartment: string | null = null;
  protected selectedStatus: string | null = null;

  protected readonly departmentOptions = [
    { label: 'All Departments', value: null },
    { label: 'Academic Affairs', value: 'Academic Affairs' },
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Design', value: 'Design' },
  ];

  protected readonly statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'On Leave', value: 'On Leave' },
  ];

  protected readonly instructors: Instructor[] = [
    {
      id: 'INS-001',
      name: 'Dr. Sarah Chen',
      email: 's.chen@eduflow.edu',
      department: 'Computer Science',
      courses: 4,
      status: 'Active',
    },
    {
      id: 'INS-002',
      name: 'Prof. Michael Ross',
      email: 'm.ross@eduflow.edu',
      department: 'Design',
      courses: 3,
      status: 'Active',
    },
    {
      id: 'INS-003',
      name: 'Dr. Emily Watson',
      email: 'e.watson@eduflow.edu',
      department: 'Computer Science',
      courses: 5,
      status: 'Active',
    },
    {
      id: 'INS-004',
      name: 'Prof. James Liu',
      email: 'j.liu@eduflow.edu',
      department: 'Academic Affairs',
      courses: 2,
      status: 'On Leave',
    },
    {
      id: 'INS-005',
      name: 'Dr. Anna Patel',
      email: 'a.patel@eduflow.edu',
      department: 'Design',
      courses: 3,
      status: 'Active',
    },
  ];

  protected getStatusSeverity(status: Instructor['status']): 'success' | 'warn' {
    return status === 'Active' ? 'success' : 'warn';
  }
}
