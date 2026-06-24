import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationDialogData } from './confirmation-dialog.interface';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [Button],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig<ConfirmationDialogData>);

  protected readonly data = this.dialogConfig.data ?? { message: 'Are you sure?' };

  protected onConfirm(): void {
    this.dialogRef.close({ confirmed: true });
  }

  protected onCancel(): void {
    this.dialogRef.close({ confirmed: false });
  }

  protected confirmButtonClass(): string {
    const severity = this.data.confirmSeverity ?? 'primary';

    if (severity === 'danger') {
      return 'p-button-danger';
    }

    if (severity === 'success') {
      return 'p-button-success';
    }

    if (severity === 'warn') {
      return 'p-button-warn';
    }

    return '';
  }
}
