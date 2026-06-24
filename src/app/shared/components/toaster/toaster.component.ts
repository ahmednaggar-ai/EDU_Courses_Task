import { Component, inject } from '@angular/core';
import { ToastMessage, ToastSeverity } from '../../interfaces/toast.interface';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
})
export class ToasterComponent {
  protected readonly toastService = inject(ToastService);

  protected iconClass(severity: ToastSeverity): string {
    const icons: Record<ToastSeverity, string> = {
      success: 'pi pi-check-circle',
      error: 'pi pi-times-circle',
      info: 'pi pi-info-circle',
      warn: 'pi pi-exclamation-triangle',
    };

    return icons[severity];
  }

  protected dismiss(toast: ToastMessage, event: Event): void {
    event.stopPropagation();
    this.toastService.dismiss(toast.id);
  }
}
