import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastOptions, ToastSeverity } from '../interfaces/toast.interface';

const DEFAULT_DURATION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toasts = this.toastsSignal.asReadonly();

  success(title: string, options?: ToastOptions): void {
    this.show('success', title, options);
  }

  error(title: string, options?: ToastOptions): void {
    this.show('error', title, options);
  }

  info(title: string, options?: ToastOptions): void {
    this.show('info', title, options);
  }

  warn(title: string, options?: ToastOptions): void {
    this.show('warn', title, options);
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);

    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.toastsSignal.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
    this.toastsSignal.set([]);
  }

  private show(severity: ToastSeverity, title: string, options?: ToastOptions): void {
    const id = this.createId();
    const duration = options?.duration ?? DEFAULT_DURATION_MS;

    const toast: ToastMessage = {
      id,
      severity,
      title,
      message: options?.message,
      duration,
    };

    this.toastsSignal.update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), duration);
      this.timers.set(id, timer);
    }
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `toast-${Date.now()}-${Math.random()}`;
  }
}
