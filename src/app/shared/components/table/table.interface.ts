export type TableCellType =
  | 'text'
  | 'currency'
  | 'tag'
  | 'status-dot'
  | 'course-name'
  | 'instructor-name'
  | 'actions';

export interface TableColumn {
  field: string;
  header: string;
  type?: TableCellType;
}

export interface TablePageEvent {
  first: number;
  rows: number;
  page?: number;
  pageCount?: number;
}

export interface TableConfig {
  clientSidePagination?: boolean;
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
}
