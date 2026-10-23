import type { SubscriptionRepository } from '@/domain/repositories/subscription.repository';
import type { SubscriptionPlan, SubscriptionState } from '@/domain/models/subscription';
import { getMockDb, delay } from '../mock-db';
import { mockSubscriptionPlans } from '../fixtures/subscriptions';

export class MockSubscriptionRepository implements SubscriptionRepository {
  async getPlans(): Promise<SubscriptionPlan[]> {
    await delay();
    return mockSubscriptionPlans;
  }

  async getCurrentState(): Promise<SubscriptionState> {
    await delay(200);
    return getMockDb().subscriptionState;
  }

  async selectPlan(planId: string): Promise<SubscriptionState> {
    await delay(400);
    const db = getMockDb();
    const plan = mockSubscriptionPlans.find((p) => p.id === planId);
    if (plan) {
      db.subscriptionState = {
        currentTier: plan.tier,
        status: 'active',
        expiresAt: undefined,
      };
    }
    return db.subscriptionState;
  }
}
