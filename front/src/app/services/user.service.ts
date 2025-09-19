import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import { UpdateProfileRequest } from '../models/update-profile-request.model';
import { MessageResponse } from '../models/auth.models';

const API_URL = 'http://localhost:8080/api/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API_URL}/me`, httpOptions);
  }

  updateUserProfile(updateRequest: UpdateProfileRequest): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(API_URL, updateRequest, httpOptions);
  }
}
