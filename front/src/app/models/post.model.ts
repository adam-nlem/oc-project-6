import { Comment } from './comment.model';

export interface Post {
  id: number;
  title: string;
  content: string;
  topicId: number;
  topicName: string;
  authorId: number;
  authorUsername: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}