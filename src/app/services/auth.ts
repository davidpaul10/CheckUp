import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);
  private router = inject(Router);

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const savedAuth = localStorage.getItem('checkup_auth');
      if (savedAuth !== null) {
        this.isLoggedIn.set(savedAuth === 'true');
      } else {
        // No saved session → starts as NOT logged in → shows login page
        this.isLoggedIn.set(false);
      }
    }
  }

  login(email?: string, password?: string): boolean {
    this.isLoggedIn.set(true);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('checkup_auth', 'true');
    }
    this.router.navigate(['/home']);
    return true;
  }

  logout(): void {
    this.isLoggedIn.set(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('checkup_auth', 'false');
    }
    this.router.navigate(['/login']);
  }
}
