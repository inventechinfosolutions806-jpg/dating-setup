import { repositories } from '@/app/composition/repositories';

export const activityService = {
  getActivities: (connectionId?: string) => repositories.activity.getActivities(connectionId),
  getById: (id: string) => repositories.activity.getActivityById(id),
  start: (id: string, connectionId: string) => repositories.activity.startActivity(id, connectionId),
  submitResponse: (activityId: string, connectionId: string, userId: string, response: string) =>
    repositories.activity.submitResponse({ activityId, connectionId, userId, response, submittedAt: new Date().toISOString() }),
};
