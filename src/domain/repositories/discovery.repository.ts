import type { Candidate } from '@/domain/models/profile';

export interface DiscoveryRepository {
  getCandidates(): Promise<Candidate[]>;
  getCandidateById(id: string): Promise<Candidate | null>;
  passCandidate(id: string): Promise<void>;
  bookmarkCandidate(id: string, bookmarked: boolean): Promise<void>;
}
