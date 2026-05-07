import type { PricingMode, ServiceType, WorkerStatus } from '@/constants';

import type { BulkDiscountType } from './service';

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface AvailabilitySlots {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface Document {
  id: string;
  type: 'id_proof' | 'license' | 'certificate' | 'other';
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectReason?: string;
}

export interface Worker {
  id: string;
  userId: string;
  displayName: string;
  tagline?: string;
  about?: string;
  coverImage?: string;
  status: WorkerStatus;
  defaultRate?: number;
  documents: Document[];
  skills: string[];
  cities: string[];
  availability: AvailabilitySlots;
  rejectReason?: string;
}

export interface WorkerInfo {
  id: string;
  displayName: string;
  tagline: string;
  about: string;
  profileImage: string;
  coverImage: string;
  experience: number;
  rate: number;
  skills: string[];
  cities: string[];
  address: string;
  isPremium: boolean;
  averageRating: number;
  completionRate: number | null;
  reviewCount: number;
  worksCompleted: number;
}

export interface ResubmitDocumentPayload {
  id: string;
  WorkerStatus?: string;
  url: string;
}

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number];
  addressLabel: string;
}

export interface PublicWorkerListItem {
  id: string;
  displayName: string;
  tagline: string;
  profileImage?: string;
  experience: number;

  serviceId: string;
  serviceRate: number;
  description: string;
  estimatedDuration: number;
  bufferTime: number;
  categoryName: string;
  serviceType: ServiceType;
  PricingMode: PricingMode;
  bulkDiscounts: BulkDiscountType[] | null;

  averageRating: number;
  reviewCount: number;
  isAvailable: boolean;
  travelCost: number;
  distanceKm: number;
  totalAmount: number;
}

export type WorkerProfile = {
  id: string;
  displayName: string;
  tagline: string;
  about: string;
  experience: number;
  profileImage?: string;
  coverImage: string;
  addressLabel: string;
  completedJobs: number;
  complitionRate: number;
  averageRating: number;
  totalReviews: number;
};

export type WorkerProfileDetails = {
  id: string;
  displayName: string;
  tagline: string;
  about: string;
  experience: number;
  phone: string;
  profileImage?: string;
  coverImage: string;
  location: GeoLocation;
  status: WorkerStatus;
  availability: AvailabilitySlots;
  rejectReason?: string;
  suspensionReason?: string;
};
