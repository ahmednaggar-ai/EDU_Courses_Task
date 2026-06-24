export type TableCellType =
  | 'text'
  | 'currency'
  | 'tag'
  | 'status-dot'
  | 'course-name'
  | 'instructor-name'
  | 'date'
  | 'actions';

export interface TableColumn {
  field: string;
  header: string;
  type?: TableCellType;
  /** When omitted or false, the column is not sortable. Set to true to enable sorting. */
  sortable?: boolean;
}

export interface TableSort {
  field: string;
  order: 1 | -1;
}

export interface TableSortEvent {
  field: string;
  order: 1 | -1 | 0;
}

export interface TablePageEvent {
  first: number;
  rows: number;
  page?: number;
  pageCount?: number;
}

export interface TableConfig {
  clientSidePagination?: boolean;
  clientSideSort?: boolean;
  paginatorEnabled?: boolean;
  rows?: number;
  totalRecords?: number;
  columns?: TableColumn[];
  styleClass?: string;
  loading?: boolean;
  emptyMessage?: string;
  skeletonRows?: number;
}

export type TablePageChangeHandler = (event: TablePageEvent) => void;
export type TableSortChangeHandler = (event: TableSortEvent) => void;

export interface TableRowAction<T = unknown> {
  label: string;
  icon?: string;
  styleClass?: string;
  visible?: (row: T) => boolean;
  command: (row: T) => void;
}

export interface TableCellHandlers<T = unknown> {
  tagSeverity?: (row: T, field: string) => string;
  statusClass?: (row: T, field: string) => string;
  formatValue?: (row: T, field: string) => string | null | undefined;
  courseNameClick?: (row: T) => void;
}
