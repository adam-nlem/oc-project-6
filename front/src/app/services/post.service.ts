import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';

const API_URL = 'http://localhost:8080/api/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }

  getFeed(page: number = 0, size: number = 10, sort: string = 'desc'): Observable<Post[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<Post[]>(API_URL, { params });
  }

  getPostsByTopic(topicId: number, page: number = 0, size: number = 10, sort: string = 'desc'): Observable<Post[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<Post[]>(`${API_URL}topic/${topicId}`, { params });
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${API_URL}${id}`);
  }

  createPost(post: { title: string; content: string; topicId: number }): Observable<Post> {
    return this.http.post<Post>(API_URL, post);
  }

  addComment(postId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${API_URL}${postId}/comments`, { content });
  }
}
