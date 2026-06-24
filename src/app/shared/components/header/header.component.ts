import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { selectCurrentUser } from '../../../features/auth/store/auth.selectors';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  imports: [FormsModule, InputText, IconField, InputIcon, ThemeToggleComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly store = inject(Store);

  protected searchQuery = '';

  protected readonly profile = toSignal(this.store.select(selectCurrentUser), {
    initialValue: null,
  });
}
