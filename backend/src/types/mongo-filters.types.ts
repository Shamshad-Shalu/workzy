import { FilterQuery, Types } from "mongoose";
import { IService } from "./service";

export interface ServiceMatchStage extends FilterQuery<IService> {
  workerId: Types.ObjectId;
  isAvailable?: boolean;
}

export interface CategorySearchMatch {
  $or: Array<
    | { "category.name": { $regex: string; $options: "i" } }
    | { "category._id": Types.ObjectId }
    | { "category.parentId": Types.ObjectId }
    | { description: { $regex: string; $options: "i" } }
  >;
}
