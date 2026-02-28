import { Document } from "mongoose";

export interface IPlanPrice {
  monthly: number;
  quarterly?: number;
  halfYearly?: number;
  yearly?: number;
}

export interface IPlan extends Document<string> {
  name: string;
  description?: string;
  price: IPlanPrice;
  isSpecialOffer: boolean;
  isActive: boolean;
  validFrom?: Date;
  validTill?: Date;
  createdAt: Date;
  updatedAt: Date;
}
