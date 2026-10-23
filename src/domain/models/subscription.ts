export type SubscriptionTier = 'free' | 'plus' | 'premium';
export type SubscriptionStatus = 'none' | 'active' | 'expired';

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isCurrent?: boolean;
}

export interface SubscriptionState {
  currentTier: SubscriptionTier;
  status: SubscriptionStatus;
  expiresAt?: string;
}
