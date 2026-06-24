import { Injectable, signal } from '@angular/core';

@Injectable()
export class LayoutService {
  private readonly sidebarOpenSignal = signal(false);

  readonly sidebarOpen = this.sidebarOpenSignal.asReadonly();

  openSidebar(): void {
    this.sidebarOpenSignal.set(true);
  }

  closeSidebar(): void {
    this.sidebarOpenSignal.set(false);
  }

  toggleSidebar(): void {
    this.sidebarOpenSignal.update((open) => !open);
  }
}
