import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtResponse } from '../../../shared/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private routerService: Router,
  ) { }

  private tokenKey = 'auth_token';
  private isLoggedInSignal = signal(false);
  private user = signal({});

  logout(): void {
    localStorage.removeItem(this.tokenKey);

    this.isLoggedInSignal.set(false);
    this.routerService.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.getUserToken() !== null;
  }

  getUserToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsernameFromToken(): string | null {
    const token = this.getUserToken();
    if (!token) {
      return null;
    }

    try {
      const decodedToken: JwtResponse = jwtDecode(token);
      return decodedToken.name || null;
    } catch (error) {
      console.error("Failed to decode JWT token:", error);
      return null;
    }
  }
}
