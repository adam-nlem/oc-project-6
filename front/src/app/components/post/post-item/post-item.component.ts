import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent {
  @Input() post!: Post;
  @Input() formatDate!: (dateString: string) => string;
  @Input() truncateContent!: (content: string, maxLength?: number) => string;
  @Output() postClick = new EventEmitter<Post>();

  onPostClick(): void {
    this.postClick.emit(this.post);
  }
}
