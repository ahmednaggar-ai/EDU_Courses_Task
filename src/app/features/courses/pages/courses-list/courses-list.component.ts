import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { timer } from 'rxjs';
import { FilterService } from '../../../../shared/components/filters/filter.service';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { FilterValues } from '../../../../shared/components/filters/filters.interface';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TableService } from '../../../../shared/components/table/table.service';
import { Course } from '../../models/course.interface';
import { CourseCategorySeverityMap, CourseStat } from './courses-list.interface';

@Component({
  selector: 'app-courses-list',
  providers: [TableService, FilterService],
  imports: [Button, FiltersComponent, TableComponent],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss',
})
export class CoursesListComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly tableService = inject(TableService<Course>);
  private readonly filterService = inject(FilterService);

  private readonly coursesData: Course[] = [
    {
      id: 'CRS-2024-001',
      name: 'Angular Fundamentals',
      instructor: 'Dr. Sarah Chen',
      category: 'FRONTEND',
      duration: '12 Weeks',
      price: 499,
      status: 'Active',
      icon: 'pi pi-code',
      iconColor: '#2563eb',
    },
    {
      id: 'CRS-2024-002',
      name: 'UI/UX Design Principles',
      instructor: 'Prof. Michael Ross',
      category: 'DESIGN',
      duration: '8 Weeks',
      price: 399,
      status: 'Active',
      icon: 'pi pi-palette',
      iconColor: '#0ea5e9',
    },
    {
      id: 'CRS-2024-003',
      name: 'Node.js Backend Dev',
      instructor: 'Dr. Emily Watson',
      category: 'BACKEND',
      duration: '10 Weeks',
      price: 549,
      status: 'Draft',
      icon: 'pi pi-server',
      iconColor: '#6366f1',
    },
    {
      id: 'CRS-2024-004',
      name: 'Advanced TypeScript',
      instructor: 'Dr. Sarah Chen',
      category: 'FRONTEND',
      duration: '6 Weeks',
      price: 449,
      status: 'Active',
      icon: 'pi pi-code',
      iconColor: '#2563eb',
    },
    {
      id: 'CRS-2024-005',
      name: 'Database Architecture',
      instructor: 'Prof. James Liu',
      category: 'BACKEND',
      duration: '14 Weeks',
      price: 599,
      status: 'Archived',
      icon: 'pi pi-database',
      iconColor: '#6366f1',
    },
  ];

  protected readonly stats: CourseStat[] = [
    {
      label: 'Total Enrollment',
      value: '12,402',
      trend: '+12% from last month',
      trendUp: true,
      icon: 'pi pi-chart-line',
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
    },
    {
      label: 'Avg. Course Rating',
      value: '4.8 / 5.0',
      trend: 'Based on 3.2k reviews',
      trendUp: null,
      icon: 'pi pi-star-fill',
      iconBg: '#fef3c7',
      iconColor: '#d97706',
    },
    {
      label: 'Monthly Revenue',
      value: '$124,500',
      trend: '+5.4% target growth',
      trendUp: true,
      icon: 'pi pi-wallet',
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
    },
  ];

  private readonly categorySeverityMap: CourseCategorySeverityMap = {
    FRONTEND: 'info',
    DESIGN: 'success',
    BACKEND: 'warn',
  };

  constructor() {
    this.initTable();
    this.initFilters();
    this.loadCourses();
  }

  private initTable(): void {
    this.tableService.configure({
      clientSidePagination: true,
      paginatorEnabled: true,
      rows: 10,
      skeletonRows: 5,
      emptyMessage: 'No courses match your filters. Try adjusting your search.',
      styleClass: 'app-table',
      columns: [
        { field: 'name', header: 'COURSE NAME', type: 'course-name' },
        { field: 'instructor', header: 'INSTRUCTOR', type: 'text' },
        { field: 'category', header: 'CATEGORY', type: 'tag' },
        { field: 'duration', header: 'DURATION', type: 'text' },
        { field: 'price', header: 'PRICE', type: 'currency' },
        { field: 'status', header: 'STATUS', type: 'status-dot' },
        { field: 'actions', header: '', type: 'actions' },
      ],
    });

    this.tableService.setCellHandlers({
      tagSeverity: (row) => this.categorySeverityMap[row.category],
      statusClass: (row) => `status-dot--${row.status.toLowerCase()}`,
      actionClick: () => undefined,
    });
  }

  private initFilters(): void {
    this.filterService.configure({
      debounceMs: 200,
      fields: [
        {
          key: 'search',
          type: 'text',
          placeholder: 'Search courses...',
        },
        {
          key: 'status',
          type: 'select',
          placeholder: 'All Status',
          options: [
            { label: 'All Status', value: null },
            { label: 'Active', value: 'Active' },
            { label: 'Draft', value: 'Draft' },
            { label: 'Archived', value: 'Archived' },
          ],
        },
        {
          key: 'category',
          type: 'select',
          placeholder: 'All Categories',
          options: [
            { label: 'All Categories', value: null },
            { label: 'Frontend', value: 'FRONTEND' },
            { label: 'Design', value: 'DESIGN' },
            { label: 'Backend', value: 'BACKEND' },
          ],
        },
      ],
    });

    this.filterService.setFilterHandler((values) => this.loadCourses(values));
  }

  private loadCourses(values: FilterValues = {}): void {
    this.tableService.setLoading(true);
    this.tableService.clearError();

    timer(800)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const filtered = this.filterCourses(values);
        this.tableService.setData(filtered);
        this.tableService.setLoading(false);
      });
  }

  private filterCourses(values: FilterValues): Course[] {
    const search = String(values['search'] ?? '')
      .trim()
      .toLowerCase();

    return this.coursesData.filter((course) => {
      if (values['status'] && course.status !== values['status']) {
        return false;
      }

      if (values['category'] && course.category !== values['category']) {
        return false;
      }

      if (search) {
        const haystack = `${course.name} ${course.instructor} ${course.id}`.toLowerCase();
        if (!haystack.includes(search)) {
          return false;
        }
      }

      return true;
    });
  }
}
