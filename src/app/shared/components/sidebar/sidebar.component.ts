import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ProgressBar],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-th-large', route: '/dashboard' },
    { label: 'Courses', icon: 'pi pi-book', route: '/courses' },
    { label: 'Instructors', icon: 'pi pi-users', route: '/instructors' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
  ];

  protected readonly storageUsed = 72;
}
