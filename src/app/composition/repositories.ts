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

import { SupabaseAuthRepository } from '@/infra/repositories/supabase-auth.repository';
import { SupabaseMessagingRepository } from '@/infra/repositories/supabase-messaging.repository';
import { SupabaseNotificationRepository } from '@/infra/repositories/supabase-notification.repository';
import { SupabaseSafetyRepository } from '@/infra/repositories/supabase-safety.repository';

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

const supabaseAuth = new SupabaseAuthRepository();
const supabaseMessaging = new SupabaseMessagingRepository();
const supabaseNotification = new SupabaseNotificationRepository();
const supabaseSafety = new SupabaseSafetyRepository();

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

const useSupabase = DATA_SOURCE === 'supabase';

export const repositories: RepositoryMap = {
  discovery: mockDiscovery,
  introduction: mockIntroduction,
  connection: mockConnection,
  activity: mockActivity,
  messaging: useSupabase ? supabaseMessaging : mockMessaging,
  notification: useSupabase ? supabaseNotification : mockNotification,
  subscription: mockSubscription,
  safety: useSupabase ? supabaseSafety : mockSafety,
  auth: useSupabase ? supabaseAuth : mockAuth,
};
