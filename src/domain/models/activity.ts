export type ActivityCategory =
  | 'daily-question'
  | 'values-conversation'
  | 'scenario'
  | 'quiz'
  | 'communication'
  | 'mini-game';

export type ActivityDepth = 'light' | 'moderate' | 'deep';

export type ActivityParticipationState =
  | 'not-started'
  | 'in-progress'
  | 'completed';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  depth: ActivityDepth;
  estimatedDuration: string;
  examplePrompt: string;
  participationState: ActivityParticipationState;
  connectionId?: string;
}

export interface ActivitySubmission {
  activityId: string;
  connectionId: string;
  userId: string;
  response: string;
  submittedAt: string;
}
