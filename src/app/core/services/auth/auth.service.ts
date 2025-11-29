import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtResponse, LoginCredentials, RegisterBody, RegisterResponse } from '../../../shared/auth.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private routerService: Router,
    private httpService: HttpClient,
  ) {
    this.initializeAuthState();
  }

  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private isLoggedInSignal = signal(false);
  public user = signal<JwtResponse | null>(null);

  register(body: RegisterBody): Observable<RegisterResponse> {
    return this.httpService.post<RegisterResponse>(`${this.apiUrl}/register`, body);
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.httpService.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(data => {
        localStorage.setItem(this.tokenKey, data.token);
        const decoded: JwtResponse = jwtDecode(data.token);
        this.user.set(decoded);
        this.isLoggedInSignal.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.user.set(null);
    this.isLoggedInSignal.set(false);
    this.routerService.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.getUserToken() !== null;
  }

  getUserToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private initializeAuthState() {
    const token = this.getUserToken();
    if (!token) return;

    this.isLoggedInSignal.set(true);

    try {
      const decoded: JwtResponse = jwtDecode(token);
      this.user.set(decoded);
    } catch (e) {
      console.error('Token inválido', e);
      this.logout();
    }
  }
}
