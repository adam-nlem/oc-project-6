import { Component, OnInit } from '@angular/core';
import { Topic } from 'src/app/models/topic.model';
import { TopicService } from 'src/app/services/topic.service';

@Component({
  selector: 'app-topic-list-page',
  templateUrl: './topic-list-page.component.html',
  styleUrls: ['./topic-list-page.component.scss']
})
export class TopicListPageComponent implements OnInit {
  topics: Topic[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private topicService: TopicService) { }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.isLoading = true;
    this.topicService.getAllTopics().subscribe({
      next: (data: Topic[]) => {
        console.log(data)
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

  onToggleSubscription(topic: Topic): void {
    if (topic.isSubscribed) {
      this.unsubscribe(topic);
    } else {
      this.subscribe(topic);
    }
  }

  private subscribe(topic: Topic): void {
    this.topicService.subscribeTopic(topic.id).subscribe({
      next: (response) => {
        console.log('Subscription successful:', response);
        topic.isSubscribed = true;
      },
      error: (err: any) => {
        console.error('Error subscribing to topic:', err);
        alert('Erreur lors de l\'abonnement: ' + (err.error?.message || err.message || 'Erreur inconnue'));
      }
    });
  }

  private unsubscribe(topic: Topic): void {
    this.topicService.unsubscribeTopic(topic.id).subscribe({
      next: () => {
        topic.isSubscribed = false;
      },
      error: (err: any) => {
        console.error('Error unsubscribing from topic:', err);
      }
    });
  }
}
