import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthActions } from '../../store/auth.actions';
import { selectAuthLoading } from '../../store/auth.selectors';

@Component({
  selector: 'app-sign-in',
  imports: [
    FormsModule,
    RouterLink,
    Button,
    Checkbox,
    InputText,
    Password,
    IconField,
    InputIcon,
    ThemeToggleComponent,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  protected readonly loading = toSignal(this.store.select(selectAuthLoading), {
    initialValue: false,
  });

  protected email = '';
  protected password = '';
  protected rememberMe = false;

  protected submit(): void {
    const email = this.email.trim();
    const password = this.password;

    if (!email || !password) {
      this.toast.error('Sign in failed', { message: 'Email and password are required.' });
      return;
    }

    this.store.dispatch(
      AuthActions.signIn({
        email,
        password,
        rememberMe: this.rememberMe,
      }),
    );
  }
}
