import type { DiscoveryRepository } from '@/domain/repositories/discovery.repository';
import type { Candidate } from '@/domain/models/profile';
import { getMockDb, delay } from '../mock-db';

export class MockDiscoveryRepository implements DiscoveryRepository {
  async getCandidates(): Promise<Candidate[]> {
    await delay();
    const db = getMockDb();
    return db.candidates.filter((c) => !db.passedCandidates.has(c.id));
  }

  async getCandidateById(id: string): Promise<Candidate | null> {
    await delay(200);
    const db = getMockDb();
    return db.candidates.find((c) => c.id === id) ?? null;
  }

  async passCandidate(id: string): Promise<void> {
    await delay(200);
    getMockDb().passedCandidates.add(id);
  }

  async bookmarkCandidate(id: string, bookmarked: boolean): Promise<void> {
    await delay(150);
    const db = getMockDb();
    if (bookmarked) {
      db.bookmarkedCandidates.add(id);
    } else {
      db.bookmarkedCandidates.delete(id);
    }
  }
}
