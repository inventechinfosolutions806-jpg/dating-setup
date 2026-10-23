import type { Activity, ActivitySubmission } from '@/domain/models/activity';

export interface ActivityRepository {
  getActivities(connectionId?: string): Promise<Activity[]>;
  getActivityById(id: string): Promise<Activity | null>;
  startActivity(id: string, connectionId: string): Promise<Activity>;
  submitResponse(submission: ActivitySubmission): Promise<void>;
}
