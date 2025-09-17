import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';
import { Topic } from 'src/app/models/topic.model';

@Component({
  selector: 'app-post-create-page',
  templateUrl: './post-create-page.component.html',
  styleUrls: ['./post-create-page.component.scss']
})
export class PostCreatePageComponent implements OnInit {
  postForm!: FormGroup;
  topics: Topic[] = [];
  isSubmitted = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private topicService: TopicService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      topicId: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]]
    });

    this.loadTopics();
  }

  get f() {
    return this.postForm.controls;
  }

  loadTopics(): void {
    this.topicService.getAllTopics().subscribe({
      next: (data: Topic[]) => {
        this.topics = data;
      },
      error: (err: any) => {
        console.error('Error loading topics:', err);
        this.errorMessage = 'Erreur lors du chargement des thèmes';
      }
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.postForm.invalid) {
      return;
    }

    this.isLoading = true;

    const postData = {
      topicId: parseInt(this.postForm.value.topicId),
      title: this.postForm.value.title,
      content: this.postForm.value.content
    };

    this.postService.createPost(postData).subscribe({
      next: (response) => {
        this.router.navigate(['/posts']);
      },
      error: (err: any) => {
        console.error('Error creating post:', err);
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de la création de l\'article';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}
