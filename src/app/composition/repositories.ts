import {
  type DiscoveryRepository,
  type IntroductionRepository,
  type ConnectionRepository,
  type ActivityRepository,
  type MessagingRepository,
  type NotificationRepository,
  type SubscriptionRepository,
  type SafetyRepository,
  type AuthRepository,
} from '@/domain/repositories';

import { MockDiscoveryRepository } from '@/mocks/repositories/mock-discovery.repository';
import { MockIntroductionRepository } from '@/mocks/repositories/mock-introduction.repository';
import { MockConnectionRepository } from '@/mocks/repositories/mock-connection.repository';
import { MockActivityRepository } from '@/mocks/repositories/mock-activity.repository';
import { MockMessagingRepository } from '@/mocks/repositories/mock-messaging.repository';
import { MockNotificationRepository } from '@/mocks/repositories/mock-notification.repository';
import { MockSubscriptionRepository } from '@/mocks/repositories/mock-subscription.repository';
import { MockSafetyRepository } from '@/mocks/repositories/mock-safety.repository';
import { MockAuthRepository } from '@/mocks/repositories/mock-auth.repository';

import { DATA_SOURCE } from '@/config/data-source';

const mockDiscovery = new MockDiscoveryRepository();
const mockIntroduction = new MockIntroductionRepository();
const mockConnection = new MockConnectionRepository();
const mockActivity = new MockActivityRepository();
const mockMessaging = new MockMessagingRepository();
const mockNotification = new MockNotificationRepository();
const mockSubscription = new MockSubscriptionRepository();
const mockSafety = new MockSafetyRepository();
const mockAuth = new MockAuthRepository();

interface RepositoryMap {
  discovery: DiscoveryRepository;
  introduction: IntroductionRepository;
  connection: ConnectionRepository;
  activity: ActivityRepository;
  messaging: MessagingRepository;
  notification: NotificationRepository;
  subscription: SubscriptionRepository;
  safety: SafetyRepository;
  auth: AuthRepository;
}

export const repositories: RepositoryMap = (() => {
  if (DATA_SOURCE === 'http') {
    throw new Error(
      'HTTP repository implementations are not yet configured. Set DATA_SOURCE to "mock" in src/config/data-source.ts until the NestJS backend is ready.',
    );
  }

  return {
    discovery: mockDiscovery,
    introduction: mockIntroduction,
    connection: mockConnection,
    activity: mockActivity,
    messaging: mockMessaging,
    notification: mockNotification,
    subscription: mockSubscription,
    safety: mockSafety,
    auth: mockAuth,
  };
})();
