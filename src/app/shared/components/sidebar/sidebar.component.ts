import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarNavItem, SidebarUser } from './sidebar.interface';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly navItems: SidebarNavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-th-large', route: '/dashboard' },
    { label: 'Courses', icon: 'pi pi-book', route: '/courses' },
    { label: 'Instructors', icon: 'pi pi-users', route: '/instructors' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
  ];

  protected readonly user: SidebarUser = {
    name: 'Dr. Julian Reed',
    role: 'System Administrator',
    avatarUrl: 'https://i.pravatar.cc/80?img=33',
  };
}
