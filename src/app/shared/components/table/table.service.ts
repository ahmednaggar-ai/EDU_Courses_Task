import { Injectable, computed, signal } from '@angular/core';
import {
  TableCellHandlers,
  TableColumn,
  TableConfig,
  TablePageChangeHandler,
  TablePageEvent,
} from './table.interface';

@Injectable()
export class TableService<T = unknown> {
  private readonly dataSignal = signal<T[]>([]);
  private readonly columnsSignal = signal<TableColumn[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly emptyMessageSignal = signal('No records found.');
  private readonly skeletonRowsSignal = signal(5);
  private readonly clientSidePaginationSignal = signal(true);
  private readonly paginatorEnabledSignal = signal(true);
  private readonly rowsSignal = signal(10);
  private readonly firstSignal = signal(0);
  private readonly totalRecordsSignal = signal(0);
  private readonly styleClassSignal = signal('app-table');
  private readonly cellHandlersSignal = signal<TableCellHandlers<T>>({});

  private pageChangeHandler: TablePageChangeHandler | null = null;

  readonly data = this.dataSignal.asReadonly();
  readonly columns = this.columnsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly emptyMessage = this.emptyMessageSignal.asReadonly();
  readonly skeletonRows = this.skeletonRowsSignal.asReadonly();
  readonly clientSidePagination = this.clientSidePaginationSignal.asReadonly();
  readonly paginatorEnabled = this.paginatorEnabledSignal.asReadonly();
  readonly rows = this.rowsSignal.asReadonly();
  readonly first = this.firstSignal.asReadonly();
  readonly styleClass = this.styleClassSignal.asReadonly();
  readonly cellHandlers = this.cellHandlersSignal.asReadonly();

  readonly lazy = computed(() => !this.clientSidePaginationSignal());
  readonly isEmpty = computed(
    () =>
      !this.loadingSignal() &&
      !this.errorSignal() &&
      this.dataSignal().length === 0,
  );
  readonly skeletonPlaceholders = computed(() =>
    Array.from({ length: this.skeletonRowsSignal() }, (_, index) => index),
  );
  readonly totalRecords = computed(() =>
    this.clientSidePaginationSignal()
      ? this.dataSignal().length
      : this.totalRecordsSignal(),
  );

  configure(config: TableConfig): void {
    if (config.clientSidePagination !== undefined) {
      this.clientSidePaginationSignal.set(config.clientSidePagination);
    }
    if (config.paginatorEnabled !== undefined) {
      this.paginatorEnabledSignal.set(config.paginatorEnabled);
    }
    if (config.rows !== undefined) {
      this.rowsSignal.set(config.rows);
    }
    if (config.totalRecords !== undefined) {
      this.totalRecordsSignal.set(config.totalRecords);
    }
    if (config.columns !== undefined) {
      this.columnsSignal.set(config.columns);
    }
    if (config.styleClass !== undefined) {
      this.styleClassSignal.set(config.styleClass);
    }
    if (config.loading !== undefined) {
      this.loadingSignal.set(config.loading);
    }
    if (config.emptyMessage !== undefined) {
      this.emptyMessageSignal.set(config.emptyMessage);
    }
    if (config.skeletonRows !== undefined) {
      this.skeletonRowsSignal.set(config.skeletonRows);
    }
  }

  setData(data: T[]): void {
    this.dataSignal.set(data);
  }

  setColumns(columns: TableColumn[]): void {
    this.columnsSignal.set(columns);
  }

  setCellHandlers(handlers: TableCellHandlers<T>): void {
    this.cellHandlersSignal.set(handlers);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setError(message: string | null): void {
    this.errorSignal.set(message);
    if (message) {
      this.dataSignal.set([]);
    }
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  setClientSidePagination(clientSide: boolean): void {
    this.clientSidePaginationSignal.set(clientSide);
    if (clientSide) {
      this.firstSignal.set(0);
    }
  }

  setPaginatorEnabled(enabled: boolean): void {
    this.paginatorEnabledSignal.set(enabled);
  }

  setRows(rows: number): void {
    this.rowsSignal.set(rows);
  }

  setFirst(first: number): void {
    this.firstSignal.set(first);
  }

  setTotalRecords(total: number): void {
    this.totalRecordsSignal.set(total);
  }

  setStyleClass(styleClass: string): void {
    this.styleClassSignal.set(styleClass);
  }

  setPageChangeHandler(handler: TablePageChangeHandler | null): void {
    this.pageChangeHandler = handler;
  }

  handlePageChange(event: TablePageEvent): void {
    this.firstSignal.set(event.first);
    this.rowsSignal.set(event.rows);
    this.pageChangeHandler?.(event);
  }

  handleLazyLoad(event: unknown): void {
    const lazyEvent = event as { first?: number | null; rows?: number | null };
    const pageEvent: TablePageEvent = {
      first: lazyEvent.first ?? 0,
      rows: lazyEvent.rows ?? this.rowsSignal(),
    };
    this.firstSignal.set(pageEvent.first);
    this.rowsSignal.set(pageEvent.rows);
    this.pageChangeHandler?.(pageEvent);
  }

  resetPagination(): void {
    this.firstSignal.set(0);
  }

  getFieldValue(row: T, field: string): unknown {
    return (row as Record<string, unknown>)[field];
  }
}
