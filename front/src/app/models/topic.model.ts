export interface Topic {
  id: number;
  name: string;
  description: string;
  isSubscribed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
