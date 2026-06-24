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
    return `Minimum value is ${control.errors['min'].min}.`;
  }

  return 'Invalid value.';
}

export function isControlInvalid(control: AbstractControl | null): boolean {
  return !!control && control.invalid && (control.touched || control.dirty);
}

export function getFormControl(form: FormGroup, name: string): AbstractControl | null {
  return form.get(name);
}
