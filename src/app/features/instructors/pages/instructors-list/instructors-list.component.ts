import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TablePageEvent } from '../../../../shared/components/table/table.interface';
import { TableService } from '../../../../shared/components/table/table.service';
import { Instructor } from '../../models/instructor.interface';
import {
  InstructorDepartmentFilterOption,
  InstructorStatusFilterOption,
} from './instructors-list.interface';

@Component({
  selector: 'app-instructors-list',
  providers: [TableService],
  imports: [FormsModule, Button, Select, TableComponent],
  templateUrl: './instructors-list.component.html',
  styleUrl: './instructors-list.component.scss',
})
export class InstructorsListComponent {
  private readonly tableService = inject(TableService<Instructor>);

  protected readonly selectedDepartment = signal<InstructorDepartmentFilterOption['value']>(null);
  protected readonly selectedStatus = signal<InstructorStatusFilterOption['value']>(null);

  protected readonly departmentOptions: InstructorDepartmentFilterOption[] = [
    { label: 'All Departments', value: null },
    { label: 'Academic Affairs', value: 'Academic Affairs' },
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Design', value: 'Design' },
  ];

  protected readonly statusOptions: InstructorStatusFilterOption[] = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'On Leave', value: 'On Leave' },
  ];

  private readonly instructorsData: Instructor[] = [
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

  constructor() {
    this.initTable();
  }

  private initTable(): void {
    this.tableService.configure({
      clientSidePagination: false,
      paginatorEnabled: true,
      rows: 10,
      totalRecords: this.instructorsData.length,
      styleClass: 'app-table',
      columns: [
        { field: 'name', header: 'INSTRUCTOR', type: 'instructor-name' },
        { field: 'email', header: 'EMAIL', type: 'text' },
        { field: 'department', header: 'DEPARTMENT', type: 'text' },
        { field: 'courses', header: 'COURSES', type: 'text' },
        { field: 'status', header: 'STATUS', type: 'tag' },
        { field: 'actions', header: '', type: 'actions' },
      ],
    });

    this.tableService.setCellHandlers({
      tagSeverity: (row) => (row.status === 'Active' ? 'success' : 'warn'),
      actionClick: () => undefined,
    });

    this.tableService.setPageChangeHandler((event) => this.loadInstructorsPage(event));
    this.loadInstructorsPage({ first: 0, rows: 10 });
  }

  private loadInstructorsPage(event: TablePageEvent): void {
    this.tableService.setLoading(true);

    const pageData = this.instructorsData.slice(event.first, event.first + event.rows);

    this.tableService.setData(pageData);
    this.tableService.setTotalRecords(this.instructorsData.length);
    this.tableService.setFirst(event.first);
    this.tableService.setRows(event.rows);
    this.tableService.setLoading(false);
  }
}
