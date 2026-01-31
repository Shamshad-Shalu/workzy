export interface WorkerRow {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  isPremium: boolean;
  isBlocked: boolean;
  profileImage?: string;
  createdAt: string;

  status: 'pending' | 'verified' | 'rejected' | 'needs_revision';
  displayName: string;
  tagline?: string;
  about?: string;
  experience?: number;

  documents: {
    id: string;
    type: string;
    url: string;
    name?: string;
    status: string;
  }[];
  defaultRate?: number;
}

export interface WorkerResponse {
  workers: WorkerRow[];
  total: number;
}
