import { inject, Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import {
  ConfirmationDialogData,
  ConfirmationDialogResult,
} from '../components/confirmation-dialog/confirmation-dialog.interface';

@Injectable({ providedIn: 'root' })
export class AppDialogService {
  private readonly dialogService = inject(DialogService);

  open<T, D = unknown>(
    component: Type<T>,
    config: DynamicDialogConfig<D>,
  ): DynamicDialogRef<T> | null {
    return this.dialogService.open(component, {
      modal: true,
      closable: true,
      dismissableMask: false,
      ...config,
    });
  }

  confirm(data: ConfirmationDialogData, header = 'Confirm'): DynamicDialogRef<ConfirmationDialogComponent> | null {
    const ref = this.open(ConfirmationDialogComponent, {
      header,
      width: '28rem',
      styleClass: 'app-dialog',
      data,
    });

    ref?.onClose.subscribe((result: ConfirmationDialogResult | undefined) => {
      if (result?.confirmed) {
        data.onConfirm?.();
        return;
      }

      if (result?.confirmed === false) {
        data.onCancel?.();
      }
    });

    return ref;
  }
}
