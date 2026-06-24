import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { FilterService } from '../../../../shared/components/filters/filter.service';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { FilterValues } from '../../../../shared/components/filters/filters.interface';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TablePageEvent } from '../../../../shared/components/table/table.interface';
import { TableService } from '../../../../shared/components/table/table.service';
import { Instructor } from '../../models/instructor.interface';
import { InstructorsActions } from '../../store/instructors.actions';
import {
  selectFilteredInstructorsCount,
  selectInstructorDepartments,
  selectInstructorsError,
  selectInstructorsLoading,
  selectInstructorsPage,
  selectInstructorsPagination,
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
  private readonly mockDataService = inject(MockDataService);
  private readonly tableService = inject(TableService<Instructor>);
  private readonly filterService = inject(FilterService);

  constructor() {
    this.initTable();
    this.initFilters();
    this.bindStoreToTable();
    this.bindDepartmentOptions();
    this.store.dispatch(InstructorsActions.load());
  }

  private initTable(): void {
    this.tableService.configure({
      clientSidePagination: false,
      paginatorEnabled: true,
      rows: 10,
      skeletonRows: 5,
      emptyMessage: 'No instructors match your filters. Try adjusting your search.',
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

    this.tableService.setPageChangeHandler((event) => this.onPageChange(event));
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
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([pageData, total, loading, error, pagination]) => {
        if (error) {
          this.tableService.setError(error);
          this.tableService.setLoading(false);
          return;
        }

        this.tableService.clearError();
        this.tableService.setLoading(loading);

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
