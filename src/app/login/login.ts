import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { ThemeService } from '../services/theme';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  protected themeService = inject(ThemeService);

  email = signal('carlos.rodriguez@checkup.ec');
  password = signal('••••••••');
  rememberMe = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onLogin(event: Event): void {
    event.preventDefault();
    this.isLoading.set(true);
    this.errorMessage.set(null);

    setTimeout(() => {
      this.isLoading.set(false);
      this.authService.login(this.email(), this.password());
    }, 600);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
