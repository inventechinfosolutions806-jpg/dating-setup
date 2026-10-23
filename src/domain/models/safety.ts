export type BlockStatus = 'blocked' | 'reported';

export interface BlockedUser {
  id: string;
  userId: string;
  displayName: string;
  photoUrl: string;
  status: BlockStatus;
  reason?: string;
  blockedAt: string;
}
