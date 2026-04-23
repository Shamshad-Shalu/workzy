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

export interface WorkerReviewStats {
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

type ReviewBaseFields =
  | 'id'
  | 'bookingId'
  | 'serviceId'
  | 'rating'
  | 'reviewText'
  | 'media'
  | 'reply'
  | 'isEdited'
  | 'createdAt';

interface ReviewBaseView extends Pick<Review, ReviewBaseFields> {
  category: {
    id: string;
    name: string;
    iconUrl: string;
  };
}

export interface PublicReviewView extends ReviewBaseView {
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
}

export interface AdminReviewView extends ReviewBaseView {
  isHidden: boolean;
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
  worker: {
    id: string;
    name: string;
    profileImage: string;
  };
}

export interface UserReviewView extends ReviewBaseView {
  worker: {
    id: string;
    name: string;
    profileImage: string;
  };
}

export interface PublicReviewListResponse {
  reviews: PublicReviewView[];
  nextCursor: string | null;
}

export interface AdminReviewListResponse {
  reviews: AdminReviewView[];
  nextCursor: string | null;
}

export interface UserReviewListResponse {
  reviews: UserReviewView[];
  nextCursor: string | null;
}

export interface ReviewListQuery {
  limit: number;
  cursor?: string | null;

  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  rating?: number;
}

export interface AdminReviewListQuery extends ReviewListQuery {
  search?: string;
  minRating?: number;
  maxRating?: number;
  serviceId?: string;
  categoryId?: string;
  userId?: string;
  workerId?: string;
  isHidden?: boolean;
  fromDate?: string;
  toDate?: string;
}
