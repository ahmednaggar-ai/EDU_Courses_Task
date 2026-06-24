import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { LayoutService } from '../../../core/services/layout.service';
import { AuthActions } from '../../../features/auth/store/auth.actions';
import { selectCurrentUser } from '../../../features/auth/store/auth.selectors';
import { SidebarNavItem } from './sidebar.interface';

@Component({
  selector: 'app-sidebar',
  host: {
    '[class.sidebar--open]': 'layout.sidebarOpen()',
  },
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly store = inject(Store);
  protected readonly layout = inject(LayoutService);

  protected readonly navItems: SidebarNavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-th-large', route: '/dashboard' },
    { label: 'Courses', icon: 'pi pi-book', route: '/courses' },
    { label: 'Instructors', icon: 'pi pi-users', route: '/instructors' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
  ];

  protected readonly user = toSignal(this.store.select(selectCurrentUser), {
    initialValue: null,
  });

  protected closeSidebar(): void {
    this.layout.closeSidebar();
  }

  protected logout(): void {
    this.layout.closeSidebar();
    this.store.dispatch(AuthActions.signOut());
  }
}
