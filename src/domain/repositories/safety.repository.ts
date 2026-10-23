import type { BlockedUser } from '@/domain/models/safety';

export interface SafetyRepository {
  getBlockedUsers(): Promise<BlockedUser[]>;
  blockUser(userId: string, reason?: string): Promise<BlockedUser>;
  reportUser(userId: string, reason: string): Promise<BlockedUser>;
  unblockUser(userId: string): Promise<void>;
}
