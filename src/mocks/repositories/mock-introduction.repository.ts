import type { IntroductionRepository } from '@/domain/repositories/introduction.repository';
import type { Introduction, IntroductionStatus } from '@/domain/models/introduction';
import { getMockDb, delay } from '../mock-db';
import { NotFoundError } from '@/domain/errors/domain-error';

export class MockIntroductionRepository implements IntroductionRepository {
  async getReceivedIntroductions(): Promise<Introduction[]> {
    await delay();
    const db = getMockDb();
    return db.introductions.filter((i) => i.toUserId === db.currentUser.id);
  }

  async getSentIntroductions(): Promise<Introduction[]> {
    await delay();
    const db = getMockDb();
    return db.introductions.filter((i) => i.fromUserId === db.currentUser.id);
  }

  async sendIntroduction(toUserId: string, message: string): Promise<Introduction> {
    await delay(500);
    const db = getMockDb();
    const candidate = db.candidates.find((c) => c.id === toUserId);
    if (!candidate) throw new NotFoundError('Candidate', toUserId);

    const intro: Introduction = {
      id: `intro-${Date.now()}`,
      fromUserId: db.currentUser.id,
      toUserId,
      candidate: {
        id: candidate.id,
        displayName: candidate.displayName,
        age: candidate.age,
        photoUrl: candidate.photoUrl,
        city: candidate.city,
      },
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      sharedInterests: candidate.sharedInterests,
    };
    db.introductions.push(intro);
    return intro;
  }

  async updateStatus(id: string, status: IntroductionStatus): Promise<Introduction> {
    await delay(300);
    const db = getMockDb();
    const intro = db.introductions.find((i) => i.id === id);
    if (!intro) throw new NotFoundError('Introduction', id);
    intro.status = status;

    if (status === 'accepted') {
      const existingConn = db.connections.find((c) => c.userId === intro.fromUserId);
      if (!existingConn) {
        db.connections.unshift({
          id: `conn-${Date.now()}`,
          userId: intro.fromUserId,
          displayName: intro.candidate.displayName,
          age: intro.candidate.age,
          photoUrl: intro.candidate.photoUrl,
          city: intro.candidate.city,
          status: 'active',
          connectedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          sharedInterests: intro.sharedInterests,
          hasUnreadMessages: false,
          unreadCount: 0,
        });
      }
    }

    return intro;
  }

  async withdraw(id: string): Promise<void> {
    await delay(200);
    const db = getMockDb();
    const idx = db.introductions.findIndex((i) => i.id === id);
    if (idx === -1) throw new NotFoundError('Introduction', id);
    db.introductions[idx].status = 'withdrawn';
  }
}
