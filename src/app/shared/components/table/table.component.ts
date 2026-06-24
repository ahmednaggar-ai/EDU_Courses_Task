import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { TableColumn } from './table.interface';
import { TableService } from './table.service';

@Component({
  selector: 'app-table',
  imports: [TableModule, Tag, CurrencyPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  protected readonly tableService = inject(TableService);

  protected cellType(column: TableColumn): string {
    return column.type ?? 'text';
  }

  protected asRecord(row: unknown): Record<string, unknown> {
    return row as Record<string, unknown>;
  }

  protected tagSeverity(row: unknown, field: string): string {
    return this.tableService.cellHandlers().tagSeverity?.(row, field) ?? 'info';
  }

  protected statusClass(row: unknown, field: string): string {
    return this.tableService.cellHandlers().statusClass?.(row, field) ?? '';
  }

  protected onActionClick(row: unknown): void {
    this.tableService.cellHandlers().actionClick?.(row);
  }
}
