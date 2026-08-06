import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  protected themeService = inject(ThemeService);
  protected authService = inject(AuthService);

  notificationsEnabled = signal(true);
  biometricsEnabled = signal(true);
  toastMessage = signal<string | null>(null);
  toastTimeout: any = null;

  toggleDarkMode(): void {
    this.themeService.toggleTheme();
    const modeName = this.themeService.isDarkMode() ? 'Modo Oscuro' : 'Modo Claro';
    this.showToast(`${modeName} activado`);
  }

  toggleNotifications(): void {
    this.notificationsEnabled.update(v => !v);
    const msg = this.notificationsEnabled() ? 'Notificaciones activadas' : 'Notificaciones desactivadas';
    this.showToast(msg);
  }

  toggleBiometrics(): void {
    this.biometricsEnabled.update(v => !v);
    const msg = this.biometricsEnabled() ? 'Acceso biométrico activado' : 'Acceso biométrico desactivado';
    this.showToast(msg);
  }

  onLogout(): void {
    this.authService.logout();
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toastMessage.set(null);
    }, 2800);
  }
}
