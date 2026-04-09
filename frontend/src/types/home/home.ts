import type { HomeSection } from './layoutSection';

export interface HomeApiResponse {
  sections: HomeSection[];
}

export interface Worker {
  id: string;
  workerId: string;
  displayName: string;
  tagline: string;
  profileImage: string;
  experience: number;
  distance: string;

  completedJobs: number;
  verified: boolean;
}

export interface WorkersApiResponse {
  workers: Worker[];
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
