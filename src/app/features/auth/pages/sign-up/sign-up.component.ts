import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Select } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthActions } from '../../store/auth.actions';
import { selectAuthLoading } from '../../store/auth.selectors';
import { SignUpRoleOption, SignUpRoleValue } from './sign-up.interface';

@Component({
  selector: 'app-sign-up',
  imports: [
    FormsModule,
    RouterLink,
    Button,
    Checkbox,
    InputText,
    Password,
    Select,
    IconField,
    InputIcon,
    ThemeToggleComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  protected readonly loading = toSignal(this.store.select(selectAuthLoading), {
    initialValue: false,
  });

  protected fullName = '';
  protected email = '';
  protected password = '';
  protected role: SignUpRoleValue | null = null;
  protected agreedToTerms = false;

  protected readonly roles: SignUpRoleOption[] = [
    { label: 'Dean / Academic Director', value: 'dean' },
    { label: 'Department Head', value: 'head' },
    { label: 'Registrar', value: 'registrar' },
    { label: 'IT Administrator', value: 'it-admin' },
  ];

  protected submit(): void {
    const fullName = this.fullName.trim();
    const email = this.email.trim();
    const password = this.password;

    if (!fullName || !email || !password || !this.role) {
      this.toast.error('Sign up failed', { message: 'Please complete all required fields.' });
      return;
    }

    if (!this.agreedToTerms) {
      this.toast.error('Sign up failed', {
        message: 'You must agree to the Terms of Service and Privacy Policy.',
      });
      return;
    }

    if (password.length < 12 || !/[^A-Za-z0-9]/.test(password)) {
      this.toast.error('Sign up failed', {
        message: 'Password must be at least 12 characters and include 1 symbol.',
      });
      return;
    }

    this.store.dispatch(
      AuthActions.signUp({
        fullName,
        email,
        password,
        role: this.role,
      }),
    );
  }
}
