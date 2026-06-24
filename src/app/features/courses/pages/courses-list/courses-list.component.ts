import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { AdvancedFilterDialogComponent } from '../../../../shared/components/advanced-filter-dialog/advanced-filter-dialog.component';
import {
  AdvancedFilterDialogResult,
  AdvancedFilterFieldConfig,
} from '../../../../shared/interfaces/advanced-filter.interface';
import { CourseFormDialogComponent } from '../../components/course-form-dialog/course-form-dialog.component';
import { CourseFormDialogResult } from '../../components/course-form-dialog/course-form-dialog.interface';
import { FilterService } from '../../../../shared/components/filters/filter.service';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { FilterValues } from '../../../../shared/components/filters/filters.interface';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TableSortEvent } from '../../../../shared/components/table/table.interface';
import { TableService } from '../../../../shared/components/table/table.service';
import { AppDialogService } from '../../../../shared/services/app-dialog.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { hasActiveAdvancedFilters } from '../../../../shared/utils/advanced-filter.util';
import { Course } from '../../models/course.interface';
import { CoursesActions } from '../../store/courses.actions';
import {
  selectCoursesAdvancedFilters,
  selectCoursesError,
  selectCoursesLoading,
  selectCoursesSort,
  selectSortedFilteredCourses,
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
  private readonly router = inject(Router);
  private readonly appDialog = inject(AppDialogService);
  private readonly toast = inject(ToastService);
  private readonly mockDataService = inject(MockDataService);
  private readonly tableService = inject(TableService<Course>);
  private readonly filterService = inject(FilterService);

  protected readonly hasAdvancedFilters = toSignal(
    this.store
      .select(selectCoursesAdvancedFilters)
      .pipe(map((filters) => hasActiveAdvancedFilters(filters))),
    { initialValue: false },
  );

  protected readonly advancedFilterFields: AdvancedFilterFieldConfig[] = [
    { key: 'name', label: 'Course Name', type: 'text' },
    { key: 'instructor', label: 'Instructor', type: 'text' },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: this.mockDataService.getCourseCategoryFormOptions(),
    },
    { key: 'duration', label: 'Duration (Hours)', type: 'number' },
    { key: 'price', label: 'Price', type: 'number' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: this.mockDataService.getCourseStatusFormOptions(),
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

  constructor() {
    this.initTable();
    this.initFilters();
    this.bindStoreToTable();
    this.store.dispatch(CoursesActions.load());
  }

  protected openAddCourseDialog(): void {
    this.openCourseFormDialog();
  }

  protected openAdvancedFilters(): void {
    this.store
      .select(selectCoursesAdvancedFilters)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((currentFilters) => {
        const ref = this.appDialog.open(AdvancedFilterDialogComponent, {
          header: 'Advanced Course Filters',
          width: '42rem',
          styleClass: 'app-dialog',
          data: {
            fields: this.advancedFilterFields,
            filters: currentFilters,
          },
        });

        ref?.onClose
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((result: AdvancedFilterDialogResult | undefined) => {
            if (result === undefined) {
              return;
            }

            this.store.dispatch(
              CoursesActions.applyAdvancedFilters({ advancedFilters: result.filters }),
            );
          });
      });
  }

  private initTable(): void {
    const categorySeverityMap = this.mockDataService.getCategorySeverityMap();

    this.tableService.configure({
      clientSidePagination: true,
      clientSideSort: true,
      paginatorEnabled: true,
      rows: 10,
      skeletonRows: 5,
      emptyMessage: 'No courses match your filters. Try adjusting your search.',
      styleClass: 'app-table',
      columns: [
        { field: 'name', header: 'COURSE NAME', type: 'course-name', sortable: true },
        { field: 'instructor', header: 'INSTRUCTOR', type: 'text', sortable: true },
        { field: 'category', header: 'CATEGORY', type: 'tag', sortable: true },
        { field: 'duration', header: 'DURATION', type: 'text' },
        { field: 'price', header: 'PRICE', type: 'currency', sortable: true },
        { field: 'status', header: 'STATUS', type: 'status-dot' },
        { field: 'createdDate', header: 'CREATED', type: 'date', sortable: true },
        { field: 'updatedDate', header: 'UPDATED', type: 'date', sortable: true },
        { field: 'actions', header: '', type: 'actions' },
      ],
    });

    this.tableService.setCellHandlers({
      tagSeverity: (row) => categorySeverityMap[row.category],
      statusClass: (row) => `status-dot--${row.status.toLowerCase()}`,
      formatValue: (row, field) =>
        field === 'duration' ? `${row.duration} Hours` : undefined,
      courseNameClick: (course) => this.viewCourse(course),
    });

    this.tableService.setRowActions([
      {
        label: 'View',
        icon: 'pi pi-eye',
        command: (course) => this.viewCourse(course),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: (course) => this.openCourseFormDialog(course),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'app-table__action-item--danger',
        command: (course) => this.confirmDeleteCourse(course),
      },
    ]);

    this.tableService.setSortChangeHandler((event) => this.onSort(event));
  }

  private viewCourse(course: Course): void {
    this.router.navigate(['/courses', course.id]);
  }

  private onSort(event: TableSortEvent): void {
    if (!event.order) {
      this.store.dispatch(CoursesActions.changeSort({ sort: null, event }));
      return;
    }

    this.store.dispatch(
      CoursesActions.changeSort({
        sort: { field: event.field, order: event.order },
        event,
      }),
    );
  }

  private openCourseFormDialog(course?: Course): void {
    const ref = this.appDialog.open(CourseFormDialogComponent, {
      header: course ? 'Edit Course' : 'Add Course',
      width: '36rem',
      styleClass: 'app-dialog',
      data: { course },
    });

    ref?.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: CourseFormDialogResult | undefined) => {
        if (!result?.course) {
          return;
        }

        if (course) {
          this.store.dispatch(CoursesActions.updateCourse({ course: result.course }));
          this.toast.success('Course updated', {
            message: `"${result.course.name}" was saved successfully.`,
          });
          return;
        }

        this.store.dispatch(CoursesActions.addCourse({ course: result.course }));
        this.toast.success('Course added', {
          message: `"${result.course.name}" was created successfully.`,
        });
      });
  }

  private confirmDeleteCourse(course: Course): void {
    this.appDialog.confirm(
      {
        message: `Delete "${course.name}"?`,
        detail: 'This action cannot be undone. The course will be permanently removed.',
        icon: 'pi pi-trash',
        iconClass: 'confirmation-dialog__icon--danger',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmSeverity: 'danger',
        onConfirm: () => {
          this.store.dispatch(CoursesActions.deleteCourse({ id: course.id }));
          this.toast.success('Course deleted', {
            message: `"${course.name}" was removed successfully.`,
          });
        },
      },
      'Delete Course',
    );
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
      this.store.select(selectSortedFilteredCourses),
      this.store.select(selectCoursesLoading),
      this.store.select(selectCoursesError),
      this.store.select(selectCoursesSort),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([courses, loading, error, sort]) => {
        if (error) {
          this.tableService.setError(error);
          this.tableService.setLoading(false);
          return;
        }

        this.tableService.clearError();
        this.tableService.setLoading(loading);

        if (sort) {
          this.tableService.setSort(sort.field, sort.order);
        } else {
          this.tableService.setSort(undefined, undefined);
        }

        if (!loading) {
          this.tableService.setData(courses);
        }
      });
  }

  private applyFilters(values: FilterValues): void {
    this.store.dispatch(CoursesActions.applyFilters({ filters: values }));
  }
}
