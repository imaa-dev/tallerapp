export interface PlanFeature {
  id: number;
  plan_id: number;
  name: string;
  value: string;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  duration_months: number;
  is_active: boolean;
  plan_features: PlanFeature[];
}

export interface Subscription {
  id: number;
  organization_id: number;
  plan_id: number;
  status: "trial" | "active" | "expired" | "pending" | "cancelled";
  starts_at: string;
  ends_at: string;
  plan?: Plan;
}

export interface SubscriptionResponse {
  subscription: Subscription | null;
  plans: Plan[];
}
