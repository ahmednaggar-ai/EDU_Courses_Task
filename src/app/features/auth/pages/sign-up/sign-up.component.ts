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
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  protected fullName = '';
  protected email = '';
  protected password = '';
  protected role: string | null = null;
  protected agreedToTerms = false;

  protected readonly roles = [
    { label: 'Dean / Academic Director', value: 'dean' },
    { label: 'Department Head', value: 'head' },
    { label: 'Registrar', value: 'registrar' },
    { label: 'IT Administrator', value: 'it-admin' },
  ];
}
