export type ToastSeverity = 'success' | 'error' | 'info' | 'warn';

export interface ToastMessage {
  id: string;
  severity: ToastSeverity;
  title: string;
  message?: string;
  duration: number;
}

export interface ToastOptions {
  message?: string;
  duration?: number;
}
