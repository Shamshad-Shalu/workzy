import type { HomeSection } from './layoutSection';

export interface HomeApiResponse {
  sections: HomeSection[];
}

export interface NearbyWorkerItem {
  id: string;
  displayName: string;
  tagline: string;
  profileImage?: string;
  experience: number;
  distance: string;
  completedJobs: number;
  averageRating: number;
}

export interface NearbyWorkerListResponse {
  workers: NearbyWorkerItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  baseRate: number;
}

export interface ServiceSuggestionApiResponse {
  services: ServiceItem[];
}
export interface TopServiceItem {
  categoryId: string;
  name: string;
  imageUrl: string;
  bookings?: number;
}

export interface TopServicesApiResponse {
  services: TopServiceItem[];
}

export type NearbyWorkerListQuery = {
  radius: number;
  limit: number;
  lat: number;
  lng: number;
};
