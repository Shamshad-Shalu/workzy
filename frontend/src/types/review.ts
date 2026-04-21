export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  workerId: string;
  serviceId: string;
  categoryId: string;
  rating: number;
  reviewText?: string;
  media?: {
    url: string;
    type: 'image' | 'video';
  }[];
  reply?: {
    message: string;
    repliedAt: Date;
  };
  isEdited: boolean;
  isHidden: boolean;
  createdAt: Date;
}
