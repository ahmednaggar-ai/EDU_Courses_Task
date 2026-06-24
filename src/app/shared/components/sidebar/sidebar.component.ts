import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../../features/auth/store/auth.selectors';
import { SidebarNavItem } from './sidebar.interface';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly store = inject(Store);

  protected readonly navItems: SidebarNavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-th-large', route: '/dashboard' },
    { label: 'Courses', icon: 'pi pi-book', route: '/courses' },
    { label: 'Instructors', icon: 'pi pi-users', route: '/instructors' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
  ];

  protected readonly user = toSignal(this.store.select(selectCurrentUser), {
    initialValue: null,
  });
}
