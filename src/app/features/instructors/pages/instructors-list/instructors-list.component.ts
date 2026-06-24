import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { AdvancedFilterDialogComponent } from '../../../../shared/components/advanced-filter-dialog/advanced-filter-dialog.component';
import {
  AdvancedFilterDialogResult,
  AdvancedFilterFieldConfig,
} from '../../../../shared/interfaces/advanced-filter.interface';
import { InstructorFormDialogComponent } from '../../components/instructor-form-dialog/instructor-form-dialog.component';
import { InstructorFormDialogResult } from '../../components/instructor-form-dialog/instructor-form-dialog.interface';
import { FilterService } from '../../../../shared/components/filters/filter.service';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { FilterValues } from '../../../../shared/components/filters/filters.interface';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TablePageEvent, TableSortEvent } from '../../../../shared/components/table/table.interface';
import { TableService } from '../../../../shared/components/table/table.service';
import { AppDialogService } from '../../../../shared/services/app-dialog.service';
import { hasActiveAdvancedFilters } from '../../../../shared/utils/advanced-filter.util';
import { CoursesActions } from '../../../courses/store/courses.actions';
import { Instructor, InstructorTableRow } from '../../models/instructor.interface';
import { InstructorsActions } from '../../store/instructors.actions';
import {
  selectFilteredInstructorsCount,
  selectInstructorDepartments,
  selectInstructorsAdvancedFilters,
  selectInstructorsError,
  selectInstructorsLoading,
  selectInstructorsPage,
  selectInstructorsPagination,
  selectInstructorsSort,
} from '../../store/instructors.selectors';

@Component({
  selector: 'app-instructors-list',
  providers: [TableService, FilterService],
  imports: [Button, FiltersComponent, TableComponent],
  templateUrl: './instructors-list.component.html',
  styleUrl: './instructors-list.component.scss',
})
export class InstructorsListComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly appDialog = inject(AppDialogService);
  private readonly mockDataService = inject(MockDataService);
  private readonly tableService = inject(TableService<InstructorTableRow>);
  private readonly filterService = inject(FilterService);

  protected readonly hasAdvancedFilters = toSignal(
    this.store
      .select(selectInstructorsAdvancedFilters)
      .pipe(map((filters) => hasActiveAdvancedFilters(filters))),
    { initialValue: false },
  );

  protected readonly advancedFilterFields: AdvancedFilterFieldConfig[] = [
    { key: 'name', label: 'Instructor Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: this.mockDataService.getInstructorDepartmentOptions(),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: this.mockDataService.getInstructorStatusFormOptions(),
    },
    { key: 'courses', label: 'Courses Count', type: 'number' },
  ];

  constructor() {
    this.initTable();
    this.initFilters();
    this.bindStoreToTable();
    this.bindDepartmentOptions();
    this.store.dispatch(InstructorsActions.load());
    this.store.dispatch(CoursesActions.load());
  }

  protected openAddInstructorDialog(): void {
    this.openInstructorFormDialog();
  }

  protected openAdvancedFilters(): void {
    this.store
      .select(selectInstructorsAdvancedFilters)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((currentFilters) => {
        const ref = this.appDialog.open(AdvancedFilterDialogComponent, {
          header: 'Advanced Instructor Filters',
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
              InstructorsActions.applyAdvancedFilters({ advancedFilters: result.filters }),
            );
          });
      });
  }

  private initTable(): void {
    this.tableService.configure({
      clientSidePagination: false,
      clientSideSort: false,
      paginatorEnabled: true,
      rows: 10,
      skeletonRows: 5,
      emptyMessage: 'No instructors match your filters. Try adjusting your search.',
      styleClass: 'app-table',
      columns: [
        { field: 'name', header: 'INSTRUCTOR', type: 'instructor-name', sortable: true },
        { field: 'email', header: 'EMAIL', type: 'text', sortable: true },
        { field: 'department', header: 'DEPARTMENT', type: 'text', sortable: true },
        { field: 'courses', header: 'COURSES', type: 'text', sortable: true },
        { field: 'status', header: 'STATUS', type: 'tag' },
        { field: 'actions', header: '', type: 'actions' },
      ],
    });

    this.tableService.setCellHandlers({
      tagSeverity: (row) => (row.status === 'Active' ? 'success' : 'warn'),
    });

    this.tableService.setRowActions([
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: (instructor) => this.openInstructorFormDialog(instructor),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        styleClass: 'app-table__action-item--danger',
        command: (instructor) => this.confirmDeleteInstructor(instructor),
      },
    ]);

    this.tableService.setPageChangeHandler((event) => this.onPageChange(event));
    this.tableService.setSortChangeHandler((event) => this.onSort(event));
  }

  private onSort(event: TableSortEvent): void {
    if (!event.order) {
      this.store.dispatch(InstructorsActions.changeSort({ sort: null, event }));
      return;
    }

    this.store.dispatch(
      InstructorsActions.changeSort({
        sort: { field: event.field, order: event.order },
        event,
      }),
    );
  }

  private openInstructorFormDialog(instructor?: Instructor): void {
    const ref = this.appDialog.open(InstructorFormDialogComponent, {
      header: instructor ? 'Edit Instructor' : 'Add Instructor',
      width: '32rem',
      styleClass: 'app-dialog',
      data: { instructor },
    });

    ref?.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: InstructorFormDialogResult | undefined) => {
        if (!result?.instructor) {
          return;
        }

        if (instructor) {
          this.store.dispatch(InstructorsActions.updateInstructor({ instructor: result.instructor }));
          return;
        }

        this.store.dispatch(InstructorsActions.addInstructor({ instructor: result.instructor }));
      });
  }

  private confirmDeleteInstructor(instructor: Instructor): void {
    this.appDialog.confirm(
      {
        message: `Delete "${instructor.name}"?`,
        detail: 'This instructor profile will be permanently removed from the system.',
        icon: 'pi pi-trash',
        iconClass: 'confirmation-dialog__icon--danger',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmSeverity: 'danger',
        onConfirm: () => {
          this.store.dispatch(InstructorsActions.deleteInstructor({ id: instructor.id }));
        },
      },
      'Delete Instructor',
    );
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
          options: [{ label: 'All Departments', value: null }],
        },
        {
          key: 'status',
          type: 'select',
          placeholder: 'All Status',
          options: this.mockDataService.getInstructorStatuses(),
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

  private bindStoreToTable(): void {
    combineLatest([
      this.store.select(selectInstructorsPage),
      this.store.select(selectFilteredInstructorsCount),
      this.store.select(selectInstructorsLoading),
      this.store.select(selectInstructorsError),
      this.store.select(selectInstructorsPagination),
      this.store.select(selectInstructorsSort),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([pageData, total, loading, error, pagination, sort]) => {
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
          this.tableService.setData(pageData);
          this.tableService.setTotalRecords(total);
          this.tableService.setFirst(pagination.first);
          this.tableService.setRows(pagination.rows);
        }
      });
  }

  private bindDepartmentOptions(): void {
    this.store
      .select(selectInstructorDepartments)
      .pipe(
        filter((departments) => departments.length > 0),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((departments) => {
        this.filterService.updateFieldOptions('department', [
          { label: 'All Departments', value: null },
          ...departments.map((department) => ({
            label: department,
            value: department,
          })),
        ]);
      });
  }

  private applyFilters(values: FilterValues): void {
    this.store.dispatch(InstructorsActions.applyFilters({ filters: values }));
  }

  private onPageChange(event: TablePageEvent): void {
    this.store.dispatch(
      InstructorsActions.changePage({
        pagination: { first: event.first, rows: event.rows },
      }),
    );
  }
}
