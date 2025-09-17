import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Topic } from 'src/app/models/topic.model';

@Component({
  selector: 'app-topic-item',
  templateUrl: './topic-item.component.html',
  styleUrls: ['./topic-item.component.scss']
})
export class TopicItemComponent {
  @Input() topic!: Topic;
  @Input() mode: 'subscribe' | 'unsubscribe' = 'subscribe';
  @Output() toggleSubscription = new EventEmitter<Topic>();
  @Output() unsubscribe = new EventEmitter<number>();

  onToggleSubscription(): void {
    this.toggleSubscription.emit(this.topic);
  }

  onUnsubscribe(): void {
    this.unsubscribe.emit(this.topic.id);
  }
}
