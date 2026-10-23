import { repositories } from '@/app/composition/repositories';

export const subscriptionService = {
  getPlans: () => repositories.subscription.getPlans(),
  getCurrentState: () => repositories.subscription.getCurrentState(),
  selectPlan: (planId: string) => repositories.subscription.selectPlan(planId),
};
