import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../models/post.model';
import { Comment } from '../../../models/comment.model';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  isLoading = false;
  errorMessage = '';
  newComment = '';
  isSubmittingComment = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(+postId);
    }
  }

  loadPost(id: number): void {
    this.isLoading = true;
    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.post = post;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load article. Please try again later.';
        this.isLoading = false;
        console.error('Error loading post:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onSubmitComment(): void {
    if (!this.newComment.trim() || !this.post || this.isSubmittingComment) {
      return;
    }

    this.isSubmittingComment = true;
    this.postService.addComment(this.post.id, this.newComment.trim()).subscribe({
      next: (comment) => {
        if (this.post && this.post.comments) {
          this.post.comments.push(comment);
        }
        this.newComment = '';
        this.isSubmittingComment = false;
      },
      error: (error) => {
        this.isSubmittingComment = false;
        console.error('Error adding comment:', error);
      }
    });
  }
}
