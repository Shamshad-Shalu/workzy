import { Document, ObjectId } from "mongoose";
import { IRate } from "./worker";

export type ServiceJobType = "Small Task" | "Major Project" | "Consultation";

export interface IService extends Document<string> {
  workerId: ObjectId;
  serviceId: ObjectId;
  rate: IRate;
  description?: string;
  estimatedDuration?: string;
  serviceType?: ServiceJobType;
  experience: number;
  isActive: boolean;
}

// export interface IWorkerService {
//   _id: mongoose.Types.ObjectId;
//   workerId: mongoose.Types.ObjectId;
//   categoryId: mongoose.Types.ObjectId; // Ref to level 3 Category
//   rate: number; // Override category.baseRate, within deviation
//   description?: string;
//   estimatedDuration?: number; // Override in min
//   bufferTime?: number; // Override in min
//   maxTravelRadius: number;
//   bulkDiscountTiers?: { threshold: number; percent: number }[]; // If category.allowBulkOffers
//   allowSuddenBooking?: boolean; // Override if category allows
//   isActive: boolean;
//   experience: number;
//   maxTravelCost?: number | null; // Worker choice, null=no cap
//   createdAt: Date;
// }
