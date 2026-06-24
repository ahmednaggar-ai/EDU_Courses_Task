import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Select } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
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
}
