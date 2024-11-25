import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hardcodedUser = { username: 'admin', password: 'admin123' }; // Hardcoded credentials
  private isAuthenticated = false;

  login(id: string, password: string): boolean {
    if (id === this.hardcodedUser.username && password === this.hardcodedUser.password) {
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
