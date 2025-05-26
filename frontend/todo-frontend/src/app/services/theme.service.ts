import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'preferred-theme';
  private darkMode = new BehaviorSubject<boolean>(this.getInitialTheme());
  darkMode$ = this.darkMode.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.darkMode$.subscribe(isDark => {
      if (isPlatformBrowser(this.platformId)) {
        document.body.classList.toggle('dark-theme', isDark);
        localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
      }
    });
  }

  toggleTheme() {
    this.darkMode.next(!this.darkMode.value);
  }

  private getInitialTheme(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.THEME_KEY);
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to light theme for SSR
  }
} 