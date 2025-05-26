import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly defaultDuration = 3000;

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, duration: number = this.defaultDuration) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration: number = this.defaultDuration) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration: number = this.defaultDuration) {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration: number = this.defaultDuration) {
    this.show(message, 'warning', duration);
  }

  private show(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, '×', config);
  }
} 