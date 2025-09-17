import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  isLoading = false;
  sortOrder: string = 'desc';

  constructor(
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.postService.getFeed(0, 20, this.sortOrder).subscribe({
      next: (posts) => {
        console.log(posts)
        this.posts = posts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.isLoading = false;
      }
    });
  }

  onSortChange(newSort: string): void {
    this.sortOrder = newSort;
    this.loadPosts();
  }

  createPost(): void {
    this.router.navigate(['/posts/create']);
  }

  onPostClick(post: Post): void {
    this.router.navigate(['/posts', post.id]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  truncateContent(content: string, maxLength: number = 200): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }
}
