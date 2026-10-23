import type {
  Introduction,
  IntroductionStatus,
} from '@/domain/models/introduction';
import type { Connection } from '@/domain/models/connection';
import type { Conversation, Message } from '@/domain/models/message';
import type { Activity, ActivitySubmission } from '@/domain/models/activity';
import type { AppNotification } from '@/domain/models/notification';
import type { BlockedUser } from '@/domain/models/safety';
import type { SubscriptionState } from '@/domain/models/subscription';
import type { CurrentUser } from '@/domain/models/profile';

import { mockCurrentUser } from './fixtures/profiles';
import { mockCandidates } from './fixtures/profiles';
import { mockIntroductions } from './fixtures/introductions';
import { mockConnections } from './fixtures/connections';
import { mockActivities } from './fixtures/activities';
import { mockConversations, mockMessages } from './fixtures/conversations';
import { mockNotifications } from './fixtures/notifications';
import { mockBlockedUsers } from './fixtures/safety';
import { mockSubscriptionState } from './fixtures/subscriptions';

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

interface MockDatabase {
  currentUser: CurrentUser;
  candidates: typeof mockCandidates;
  passedCandidates: Set<string>;
  bookmarkedCandidates: Set<string>;
  introductions: Introduction[];
  connections: Connection[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activities: Activity[];
  activitySubmissions: ActivitySubmission[];
  notifications: AppNotification[];
  blockedUsers: BlockedUser[];
  subscriptionState: SubscriptionState;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createInitialDb(): MockDatabase {
  return {
    currentUser: deepClone(mockCurrentUser),
    candidates: mockCandidates,
    passedCandidates: new Set<string>(),
    bookmarkedCandidates: new Set<string>(),
    introductions: deepClone(mockIntroductions),
    connections: deepClone(mockConnections),
    conversations: deepClone(mockConversations),
    messages: deepClone(mockMessages),
    activities: deepClone(mockActivities),
    activitySubmissions: [],
    notifications: deepClone(mockNotifications),
    blockedUsers: deepClone(mockBlockedUsers),
    subscriptionState: deepClone(mockSubscriptionState),
  };
}

let db: MockDatabase = createInitialDb();

export function getMockDb(): MockDatabase {
  return db;
}

export function resetMockDb(): void {
  db = createInitialDb();
}

export function delay(ms: number = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type { MockDatabase, Mutable };
