import type { SubscriptionPlan, SubscriptionState } from '@/domain/models/subscription';

export interface SubscriptionRepository {
  getPlans(): Promise<SubscriptionPlan[]>;
  getCurrentState(): Promise<SubscriptionState>;
  selectPlan(planId: string): Promise<SubscriptionState>;
}
