export interface PlanPrice {
  monthly: number;
  quarterly?: number;
  halfYearly?: number;
  yearly?: number;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: PlanPrice;
  isSpecialOffer: boolean;
  isActive: boolean;
  validFrom?: string;
  validTill?: string;
  createdAt: string;
}

export interface PlansListResponse {
  plans: Plan[];
  total: number;
}
