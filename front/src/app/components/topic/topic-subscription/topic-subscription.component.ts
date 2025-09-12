import { Component, OnInit } from '@angular/core';
import { Topic } from 'src/app/models/topic.model';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-subscription',
  templateUrl: './topic-subscription.component.html',
  styleUrls: ['./topic-subscription.component.scss']
})
export class TopicSubscriptionComponent implements OnInit {
  subscribedTopics: Topic[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private topicService: TopicService) { }

  ngOnInit(): void {
    this.loadSubscribedTopics();
  }

  loadSubscribedTopics(): void {
    this.isLoading = true;
    this.topicService.getUserSubscriptions().subscribe({
      next: (data: Topic[]) => {
        this.subscribedTopics = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load your subscriptions. Please try again later.';
        this.isLoading = false;
        console.error('Error loading subscriptions:', err);
      }
    });
  }

  unsubscribe(topicId: number): void {
    this.topicService.unsubscribeTopic(topicId).subscribe({
      next: () => {
        this.subscribedTopics = this.subscribedTopics.filter(topic => topic.id !== topicId);
      },
      error: (err: any) => {
        console.error('Error unsubscribing from topic:', err);
      }
    });
  }

  browseAllTopics(): void {
    // This will be handled by the router link in the template
  }
}
