import type { SafetyRepository } from '@/domain/repositories/safety.repository';
import type { BlockedUser } from '@/domain/models/safety';
import { getMockDb, delay } from '../mock-db';

export class MockSafetyRepository implements SafetyRepository {
  async getBlockedUsers(): Promise<BlockedUser[]> {
    await delay();
    return getMockDb().blockedUsers;
  }

  async blockUser(userId: string, reason?: string): Promise<BlockedUser> {
    await delay(300);
    const db = getMockDb();
    const candidate = db.candidates.find((c) => c.id === userId);
    const existing = db.blockedUsers.find((b) => b.userId === userId);
    if (existing) return existing;

    const blocked: BlockedUser = {
      id: `block-${Date.now()}`,
      userId,
      displayName: candidate?.displayName ?? 'Unknown',
      photoUrl: candidate?.photoUrl ?? '',
      status: 'blocked',
      reason,
      blockedAt: new Date().toISOString(),
    };
    db.blockedUsers.push(blocked);
    return blocked;
  }

  async reportUser(userId: string, reason: string): Promise<BlockedUser> {
    await delay(300);
    const db = getMockDb();
    const candidate = db.candidates.find((c) => c.id === userId);

    const reported: BlockedUser = {
      id: `report-${Date.now()}`,
      userId,
      displayName: candidate?.displayName ?? 'Unknown',
      photoUrl: candidate?.photoUrl ?? '',
      status: 'reported',
      reason,
      blockedAt: new Date().toISOString(),
    };
    db.blockedUsers.push(reported);
    return reported;
  }

  async unblockUser(userId: string): Promise<void> {
    await delay(200);
    const db = getMockDb();
    db.blockedUsers = db.blockedUsers.filter((b) => b.userId !== userId);
  }
}
