import { Component, OnInit } from '@angular/core';
import { Topic } from 'src/app/models/topic.model';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent implements OnInit {
  topics: Topic[] = [];
  subscribedTopics: number[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private topicService: TopicService) { }

  ngOnInit(): void {
    this.loadTopics();
    this.loadUserSubscriptions();
  }

  loadTopics(): void {
    this.isLoading = true;
    this.topicService.getAllTopics().subscribe({
      next: (data: Topic[]) => {
        this.topics = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load topics. Please try again later.';
        this.isLoading = false;
        console.error('Error loading topics:', err);
      }
    });
  }

  loadUserSubscriptions(): void {
    this.topicService.getUserSubscriptions().subscribe({
      next: (data: Topic[]) => {
        this.subscribedTopics = data.map((topic: Topic) => topic.id);
      },
      error: (err: any) => {
        console.error('Error loading user subscriptions:', err);
      }
    });
  }

  isSubscribed(topicId: number): boolean {
    return this.subscribedTopics.includes(topicId);
  }

  toggleSubscription(topicId: number): void {
    if (this.isSubscribed(topicId)) {
      this.unsubscribe(topicId);
    } else {
      this.subscribe(topicId);
    }
  }

  subscribe(topicId: number): void {
    this.topicService.subscribeTopic(topicId).subscribe({
      next: () => {
        this.subscribedTopics.push(topicId);
      },
      error: (err: any) => {
        console.error('Error subscribing to topic:', err);
      }
    });
  }

  unsubscribe(topicId: number): void {
    this.topicService.unsubscribeTopic(topicId).subscribe({
      next: () => {
        this.subscribedTopics = this.subscribedTopics.filter(id => id !== topicId);
      },
      error: (err: any) => {
        console.error('Error unsubscribing from topic:', err);
      }
    });
  }
}
