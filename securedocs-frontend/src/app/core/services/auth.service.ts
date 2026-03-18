import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  user = signal<any | null>(null);
  authenticated = signal(false);

  constructor(private http: HttpClient) {}

  async register(data: { username: string; email: string; password: string }): Promise<any> {
    return await firstValueFrom(
      this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true })
    );
  }

  async login(data: { identifier: string; password: string }): Promise<any> {
    const response: any = await firstValueFrom(
      this.http.post(`${this.apiUrl}/login`, data, { withCredentials: true })
    );

    this.user.set(response.user);
    this.authenticated.set(true);
    return response;
  }

  async loadSession(): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${this.apiUrl}/session`, { withCredentials: true })
      );

      this.authenticated.set(response.authenticated);

      if (response.authenticated) {
        this.user.set(response.user);
      } else {
        this.user.set(null);
      }

      return response.authenticated;
    } catch {
      this.user.set(null);
      this.authenticated.set(false);
      return false;
    }
  }

  async getProfile(): Promise<any> {
    return await firstValueFrom(
      this.http.get(`${this.apiUrl}/profile`, { withCredentials: true })
    );
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      );
    } finally {
      this.user.set(null);
      this.authenticated.set(false);
    }
  }
}