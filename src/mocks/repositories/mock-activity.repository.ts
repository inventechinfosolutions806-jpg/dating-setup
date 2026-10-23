import type { ActivityRepository } from '@/domain/repositories/activity.repository';
import type { Activity, ActivitySubmission } from '@/domain/models/activity';
import { getMockDb, delay } from '../mock-db';
import { NotFoundError } from '@/domain/errors/domain-error';

export class MockActivityRepository implements ActivityRepository {
  async getActivities(connectionId?: string): Promise<Activity[]> {
    await delay();
    const db = getMockDb();
    if (connectionId) {
      return db.activities.filter((a) => a.connectionId === connectionId || a.participationState === 'not-started');
    }
    return db.activities;
  }

  async getActivityById(id: string): Promise<Activity | null> {
    await delay(200);
    return getMockDb().activities.find((a) => a.id === id) ?? null;
  }

  async startActivity(id: string, connectionId: string): Promise<Activity> {
    await delay(300);
    const db = getMockDb();
    const activity = db.activities.find((a) => a.id === id);
    if (!activity) throw new NotFoundError('Activity', id);
    activity.participationState = 'in-progress';
    activity.connectionId = connectionId;
    return activity;
  }

  async submitResponse(submission: ActivitySubmission): Promise<void> {
    await delay(300);
    const db = getMockDb();
    const activity = db.activities.find((a) => a.id === submission.activityId);
    if (!activity) throw new NotFoundError('Activity', submission.activityId);
    activity.participationState = 'completed';
    db.activitySubmissions.push(submission);
  }
}
