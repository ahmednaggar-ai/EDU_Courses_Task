import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { HeaderUserProfile } from './header.interface';

@Component({
  selector: 'app-header',
  imports: [FormsModule, InputText, IconField, InputIcon, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected searchQuery = '';

  protected readonly profile: HeaderUserProfile = {
    name: 'Alex Rivera',
    role: 'System Admin',
    avatarUrl: 'https://i.pravatar.cc/80?img=12',
  };
}
