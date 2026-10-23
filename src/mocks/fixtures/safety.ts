import type { BlockedUser } from '@/domain/models/safety';

export const mockBlockedUsers: BlockedUser[] = [
  {
    id: 'block-001',
    userId: 'cand-017',
    displayName: 'Hannah',
    photoUrl: 'https://images.pexels.com/photos/28582416/pexels-photo-28582416.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    status: 'blocked',
    reason: 'Inappropriate messages',
    blockedAt: '2026-10-10T12:00:00Z',
  },
];
