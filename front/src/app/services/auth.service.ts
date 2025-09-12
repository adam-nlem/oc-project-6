import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtResponse, LoginRequest, MessageResponse, SignupRequest } from '../models/auth.models';

const AUTH_API = 'http://localhost:8080/api/auth/';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(AUTH_API + 'signin', credentials, httpOptions)
      .pipe(
        tap(response => {
          this.saveToken(response.accessToken);
          this.saveUser(response);
        })
      );
  }

  register(user: SignupRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(AUTH_API + 'signup', user, httpOptions);
  }

  logout(): void {
    window.sessionStorage.clear();
  }
  
  updateStoredUser(user: any): void {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...user };
      window.sessionStorage.removeItem(USER_KEY);
      window.sessionStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  }

  saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  getCurrentUser(): any {
    const userData = this.getUser();
    if (userData) {
      return userData.user || userData;
    }
    return null;
  }
}
