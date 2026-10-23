import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { connectionService } from '../services/connection.service';

export const connectionKeys = {
  all: ['connections'] as const,
  list: () => [...connectionKeys.all, 'list'] as const,
  detail: (id: string) => [...connectionKeys.all, 'detail', id] as const,
};

export function useConnections() {
  return useQuery({
    queryKey: connectionKeys.list(),
    queryFn: connectionService.getConnections,
  });
}

export function useConnection(id: string | undefined) {
  return useQuery({
    queryKey: connectionKeys.detail(id ?? ''),
    queryFn: () => connectionService.getById(id ?? ''),
    enabled: !!id,
  });
}

export function useEndConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionService.end(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
}

export function useArchiveConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionService.archive(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
}
