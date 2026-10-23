import { repositories } from '@/app/composition/repositories';

export const discoveryService = {
  getCandidates: () => repositories.discovery.getCandidates(),
  getCandidateById: (id: string) => repositories.discovery.getCandidateById(id),
  passCandidate: (id: string) => repositories.discovery.passCandidate(id),
  bookmarkCandidate: (id: string, bookmarked: boolean) =>
    repositories.discovery.bookmarkCandidate(id, bookmarked),
};
