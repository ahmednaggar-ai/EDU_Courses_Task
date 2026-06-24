import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  THEME_DARK_CLASS,
  THEME_LIGHT_CLASS,
  THEME_STORAGE_KEY,
} from '../themes/theme.constants';
import { ThemeMode } from '../interfaces/theme.interface';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly themeSignal = signal<ThemeMode>('light');

  readonly theme = this.themeSignal.asReadonly();
  readonly isDark = computed(() => this.themeSignal() === 'dark');
  readonly toggleIcon = computed(() =>
    this.isDark() ? 'pi pi-sun' : 'pi pi-moon',
  );
  readonly toggleLabel = computed(() =>
    this.isDark() ? 'Switch to light mode' : 'Switch to dark mode',
  );

  constructor() {
    this.applyTheme(this.getStoredTheme());
  }

  toggle(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  setTheme(mode: ThemeMode): void {
    this.applyTheme(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }

  private getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(mode: ThemeMode): void {
    this.themeSignal.set(mode);

    const html = this.document.documentElement;
    html.classList.remove(THEME_LIGHT_CLASS, THEME_DARK_CLASS);
    html.classList.add(mode === 'dark' ? THEME_DARK_CLASS : THEME_LIGHT_CLASS);
  }
}
