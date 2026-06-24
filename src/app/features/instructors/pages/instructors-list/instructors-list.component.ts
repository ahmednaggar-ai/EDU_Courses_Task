import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { timer } from 'rxjs';
import { FilterService } from '../../../../shared/components/filters/filter.service';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { FilterValues } from '../../../../shared/components/filters/filters.interface';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TablePageEvent } from '../../../../shared/components/table/table.interface';
import { TableService } from '../../../../shared/components/table/table.service';
import { Instructor } from '../../models/instructor.interface';

@Component({
  selector: 'app-instructors-list',
  providers: [TableService, FilterService],
  imports: [Button, FiltersComponent, TableComponent],
  templateUrl: './instructors-list.component.html',
  styleUrl: './instructors-list.component.scss',
})
export class InstructorsListComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly tableService = inject(TableService<Instructor>);
  private readonly filterService = inject(FilterService);

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

  private filteredInstructors: Instructor[] = [...this.instructorsData];

  constructor() {
    this.initTable();
    this.initFilters();
  }

  private initTable(): void {
    this.tableService.configure({
      clientSidePagination: false,
      paginatorEnabled: true,
      rows: 10,
      skeletonRows: 5,
      emptyMessage: 'No instructors match your filters. Try adjusting your search.',
      totalRecords: this.filteredInstructors.length,
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

  private initFilters(): void {
    this.filterService.configure({
      debounceMs: 200,
      fields: [
        {
          key: 'search',
          type: 'text',
          placeholder: 'Search instructors...',
        },
        {
          key: 'department',
          type: 'select',
          placeholder: 'All Departments',
          options: [
            { label: 'All Departments', value: null },
            { label: 'Academic Affairs', value: 'Academic Affairs' },
            { label: 'Computer Science', value: 'Computer Science' },
            { label: 'Design', value: 'Design' },
          ],
        },
        {
          key: 'status',
          type: 'select',
          placeholder: 'All Status',
          options: [
            { label: 'All Status', value: null },
            { label: 'Active', value: 'Active' },
            { label: 'On Leave', value: 'On Leave' },
          ],
        },
        {
          key: 'joinedDate',
          type: 'datepicker',
          placeholder: 'Joined after',
        },
      ],
    });

    this.filterService.setFilterHandler((values) => this.applyFilters(values));
  }

  private applyFilters(values: FilterValues): void {
    const search = String(values['search'] ?? '')
      .trim()
      .toLowerCase();

    this.filteredInstructors = this.instructorsData.filter((instructor) => {
      if (values['department'] && instructor.department !== values['department']) {
        return false;
      }

      if (values['status'] && instructor.status !== values['status']) {
        return false;
      }

      if (search) {
        const haystack =
          `${instructor.name} ${instructor.email} ${instructor.id}`.toLowerCase();
        if (!haystack.includes(search)) {
          return false;
        }
      }

      return true;
    });

    this.loadInstructorsPage({ first: 0, rows: this.tableService.rows() });
  }

  private loadInstructorsPage(event: TablePageEvent): void {
    this.tableService.setLoading(true);
    this.tableService.clearError();

    timer(600)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const pageData = this.filteredInstructors.slice(event.first, event.first + event.rows);

        this.tableService.setData(pageData);
        this.tableService.setTotalRecords(this.filteredInstructors.length);
        this.tableService.setFirst(event.first);
        this.tableService.setRows(event.rows);
        this.tableService.setLoading(false);
      });
  }
}
