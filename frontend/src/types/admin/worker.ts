// export interface WorkerRow {
//   _id: string;
//   userId:string;
//   name: string;
//   email:string;
//   phone?: string;
//   isPremium: boolean;
//   isBlocked: boolean;
//   profileImage?: string;
//   createdAt: string;
//   status ?:string;
//   displayName:string
// }
export interface WorkerRow {
  _id: string;
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
    type: string;
    url: string;
    name?: string;
    status: string;
  }[];
  defaultRate?: {
    amount: number;
    type: 'hourly' | 'fixed';
  };
}

export interface WorkerResponse {
  workers: WorkerRow[];
  total: number;
}
