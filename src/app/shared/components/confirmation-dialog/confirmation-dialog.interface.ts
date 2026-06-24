export type ConfirmationSeverity = 'primary' | 'danger' | 'success' | 'warn';

export interface ConfirmationDialogData {
  message: string;
  detail?: string;
  icon?: string;
  iconClass?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmSeverity?: ConfirmationSeverity;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ConfirmationDialogResult {
  confirmed: boolean;
}
