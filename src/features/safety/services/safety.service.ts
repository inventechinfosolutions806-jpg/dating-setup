import { repositories } from '@/app/composition/repositories';

export const safetyService = {
  getBlockedUsers: () => repositories.safety.getBlockedUsers(),
  blockUser: (userId: string, reason?: string) => repositories.safety.blockUser(userId, reason),
  reportUser: (userId: string, reason: string) => repositories.safety.reportUser(userId, reason),
  unblockUser: (userId: string) => repositories.safety.unblockUser(userId),
};
