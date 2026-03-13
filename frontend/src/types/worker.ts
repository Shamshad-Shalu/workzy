import type { PricingMode, ServiceType } from '@/constants';

import type { BulkDiscountType } from './service';

export type WorkerStatus = 'pending' | 'verified' | 'rejected' | 'needs_revision';

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

export interface IDocument {
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
  documents: IDocument[];
  skills: string[];
  cities: string[];
  availability: AvailabilitySlots;
  rejectReason?: string;
}

export interface WorkerProfile {
  displayName: string;
  tagline?: string;
  about: string;
  coverImage: string;
  defaultRate: number;
  cities: string[];
  availability: AvailabilitySlots;
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

export interface WorkerListingInfo {
  serviceId: string;
  workerId: string;
  userId: string;
  displayName: string;
  tagline: string;
  description: string;
  coverImage: string | null;
  profileImage: string;
  experience: number;
  serviceRate: number;
  estimatedDuration: number | null;
  isAvailable: boolean;
  averageRating: number;
  completionRate: number | null;
  bulkDiscounts: BulkDiscountType[] | null;
  reviewCount: number;
  categoryName: string;
  serviceType: ServiceType;
  PricingMode: PricingMode;
  isPremium: boolean;
  totalAmount: number;
  travelCost: number | null;
  distanceKm: number | null;
}
