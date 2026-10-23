import type { SubscriptionPlan, SubscriptionState } from '@/domain/models/subscription';

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    tier: 'free',
    name: 'Discover',
    price: 'Free',
    period: '',
    description: 'Everything you need to start building meaningful connections.',
    features: [
      'Up to 5 introductions per week',
      'Basic discovery preferences',
      'Daily question activities',
      'Standard compatibility explanations',
    ],
    isCurrent: true,
  },
  {
    id: 'plan-plus',
    tier: 'plus',
    name: 'Connect',
    price: '$9.99',
    period: 'per month',
    description: 'More introductions and deeper activities for growing connections.',
    features: [
      'Unlimited introductions',
      'Advanced discovery preferences',
      'All activity types',
      'Detailed compatibility insights',
      'Bookmark candidates',
      'Priority introductions',
    ],
  },
  {
    id: 'plan-premium',
    tier: 'premium',
    name: 'Reflect',
    price: '$19.99',
    period: 'per month',
    description: 'The full MIRROR experience with every feature unlocked.',
    features: [
      'Everything in Connect',
      'Voice introductions',
      'Extended activity library',
      'Compatibility deep-dives',
      'Early access to new features',
      'Exclusive seasonal activities',
    ],
  },
];

export const mockSubscriptionState: SubscriptionState = {
  currentTier: 'free',
  status: 'active',
};
