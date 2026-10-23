import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discoveryService } from '../services/discovery.service';

export const discoveryKeys = {
  all: ['discovery'] as const,
  candidates: () => [...discoveryKeys.all, 'candidates'] as const,
  candidate: (id: string) => [...discoveryKeys.all, 'candidate', id] as const,
};

export function useDiscover() {
  return useQuery({
    queryKey: discoveryKeys.candidates(),
    queryFn: discoveryService.getCandidates,
    staleTime: 30_000,
  });
}

export function useCandidate(id: string | undefined) {
  return useQuery({
    queryKey: discoveryKeys.candidate(id ?? ''),
    queryFn: () => discoveryService.getCandidateById(id ?? ''),
    enabled: !!id,
  });
}

export function usePassCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => discoveryService.passCandidate(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: discoveryKeys.candidates() });
    },
  });
}

export function useBookmarkCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bookmarked }: { id: string; bookmarked: boolean }) =>
      discoveryService.bookmarkCandidate(id, bookmarked),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: discoveryKeys.candidates() });
    },
  });
}
