import { AbstractControl, FormGroup } from '@angular/forms';

export function getControlErrorMessage(control: AbstractControl | null): string | null {
  if (!control?.errors || !(control.touched || control.dirty)) {
    return null;
  }

  if (control.errors['required']) {
    return 'This field is required.';
  }

  if (control.errors['email']) {
    return 'Enter a valid email address.';
  }

  if (control.errors['min']) {
    const min = control.errors['min'].min;
    return min > 0 ? `Value must be greater than 0.` : `Minimum value is ${min}.`;
  }

  if (control.errors['minlength']) {
    return `Minimum ${control.errors['minlength'].requiredLength} characters required.`;
  }

  if (control.errors['maxlength']) {
    return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed.`;
  }

  if (control.errors['pattern']) {
    return 'Numbers only.';
  }

  return 'Invalid value.';
}

export function isControlInvalid(control: AbstractControl | null): boolean {
  return !!control && control.invalid && (control.touched || control.dirty);
}

export function getFormControl(form: FormGroup, name: string): AbstractControl | null {
  return form.get(name);
}
