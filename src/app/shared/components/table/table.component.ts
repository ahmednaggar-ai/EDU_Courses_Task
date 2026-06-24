import { CurrencyPipe } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { TableColumn } from './table.interface';
import { TableService } from './table.service';

@Component({
  selector: 'app-table',
  imports: [TableModule, Tag, CurrencyPipe, Skeleton, Menu],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  protected readonly tableService = inject(TableService);
  private readonly actionMenu = viewChild.required<Menu>('actionMenu');

  protected menuItems: MenuItem[] = [];

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

  protected openActionMenu(event: Event, row: unknown): void {
    event.stopPropagation();

    this.menuItems = this.tableService
      .rowActions()
      .filter((action) => action.visible?.(row) ?? true)
      .map((action) => ({
        label: action.label,
        icon: action.icon,
        styleClass: action.styleClass,
        command: () => action.command(row),
      }));

    this.actionMenu().toggle(event);
  }

  protected skeletonHeight(column: TableColumn): string {
    const type = column.type ?? 'text';

    if (type === 'course-name' || type === 'instructor-name') {
      return '2.5rem';
    }

    if (type === 'actions') {
      return '1.5rem';
    }

    return '1.25rem';
  }

  protected skeletonWidth(column: TableColumn): string {
    const type = column.type ?? 'text';

    if (type === 'actions') {
      return '1.5rem';
    }

    if (type === 'course-name' || type === 'instructor-name') {
      return '70%';
    }

    return '100%';
  }
}
