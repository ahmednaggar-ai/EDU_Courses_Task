import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { combineLatest } from 'rxjs';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { FilterService } from '../../../../shared/components/filters/filter.service';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { FilterValues } from '../../../../shared/components/filters/filters.interface';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TableService } from '../../../../shared/components/table/table.service';
import { Course } from '../../models/course.interface';
import { CoursesActions } from '../../store/courses.actions';
import {
  selectCoursesError,
  selectCoursesLoading,
  selectFilteredCourses,
} from '../../store/courses.selectors';
import { CourseStat } from './courses-list.interface';

@Component({
  selector: 'app-courses-list',
  providers: [TableService, FilterService],
  imports: [Button, FiltersComponent, TableComponent],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.scss',
})
export class CoursesListComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly mockDataService = inject(MockDataService);
  private readonly tableService = inject(TableService<Course>);
  private readonly filterService = inject(FilterService);

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

  constructor() {
    this.initTable();
    this.initFilters();
    this.bindStoreToTable();
    this.store.dispatch(CoursesActions.load());
  }

  private initTable(): void {
    const categorySeverityMap = this.mockDataService.getCategorySeverityMap();

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
      tagSeverity: (row) => categorySeverityMap[row.category],
      statusClass: (row) => `status-dot--${row.status.toLowerCase()}`,
    });

    this.tableService.setRowActions([
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: (course) => this.onEditCourse(course),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'app-table__action-item--danger',
        command: (course) => this.onDeleteCourse(course),
      },
    ]);
  }

  private onEditCourse(course: Course): void {
    console.log('Edit course:', course);
  }

  private onDeleteCourse(course: Course): void {
    console.log('Delete course:', course);
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
          options: this.mockDataService.getCourseStatuses(),
        },
        {
          key: 'category',
          type: 'select',
          placeholder: 'All Categories',
          options: this.mockDataService.getCourseCategories(),
        },
      ],
    });

    this.filterService.setFilterHandler((values) => this.applyFilters(values));
  }

  private bindStoreToTable(): void {
    combineLatest([
      this.store.select(selectFilteredCourses),
      this.store.select(selectCoursesLoading),
      this.store.select(selectCoursesError),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([courses, loading, error]) => {
        if (error) {
          this.tableService.setError(error);
          this.tableService.setLoading(false);
          return;
        }

        this.tableService.clearError();
        this.tableService.setLoading(loading);

        if (!loading) {
          this.tableService.setData(courses);
        }
      });
  }

  private applyFilters(values: FilterValues): void {
    this.store.dispatch(CoursesActions.applyFilters({ filters: values }));
  }
}
