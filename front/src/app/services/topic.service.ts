import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';

const API_URL = 'http://localhost:8080/api/topics';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  constructor(private http: HttpClient) { }

  getAllTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${API_URL}`);
  }

  getUserSubscriptions(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${API_URL}/subscribed`);
  }

  subscribeTopic(topicId: number): Observable<any> {
    return this.http.post(`${API_URL}/${topicId}/subscribe`, {});
  }

  unsubscribeTopic(topicId: number): Observable<any> {
    return this.http.delete(`${API_URL}/${topicId}/unsubscribe`);
  }
}
