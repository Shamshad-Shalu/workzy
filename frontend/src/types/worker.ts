export type WorkerStatus = 'pending' | 'verified' | 'rejected' | 'needs_revision';
export type RateType = 'hourly' | 'fixed';

export interface Rate {
  amount: number;
  type: RateType;
}

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
  _id: string;
  type: 'id_proof' | 'license' | 'certificate' | 'other';
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectReason?: string;
}

export interface Worker {
  _id: string;
  userId: string;
  displayName: string;
  tagline?: string;
  about?: string;
  coverImage?: string;
  status: WorkerStatus;
  defaultRate?: Rate;
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
  defaultRate: Rate;
  skills: string[];
  cities: string[];
  availability: AvailabilitySlots;
}

export interface WorkerInfo {
  _id: string;
  displayName: string;
  tagline: string;
  location: string;
  experience?: string;
  responseTime?: string;
  rating: number;
  reviewsCount?: number;
  rate: Rate;
  availability: string;
  profileImage: string;
  coverImage?: string;
}

export interface WorkerStats {
  jobsCompleted: number;
  averageRating: number;
  completionRate: number;
}
