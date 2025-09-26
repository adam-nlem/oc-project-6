import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserProfile } from '../models/user-profile.model';
import { UpdateProfileRequest } from '../models/update-profile-request.model';
import { JwtResponse } from '../models/auth.models';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8080/api/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_URL}/me`, httpOptions);
  }

  updateUserProfile(updateRequest: UpdateProfileRequest): Observable<JwtResponse> {
    return this.http.put<JwtResponse>(API_URL, updateRequest, httpOptions)
      .pipe(
        tap(response => {
          this.authService.saveToken(response.accessToken);
          this.authService.saveUser(response);
        })
      );
  }
}
