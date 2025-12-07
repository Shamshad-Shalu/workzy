import { Document, ObjectId } from "mongoose";
import { IRate } from "./worker";

export type ServiceJobType = "Small Task" | "Major Project" | "Consultation";

export interface IWorkerService extends Document<string> {
  workerId: ObjectId;
  serviceId: ObjectId;
  rate: IRate;
  description?: string;
  estimatedDuration?: string;
  serviceType?: ServiceJobType;
  experience: number;
  isActive: boolean;
}
