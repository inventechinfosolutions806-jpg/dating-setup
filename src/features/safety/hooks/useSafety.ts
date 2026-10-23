import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { safetyService } from '../services/safety.service';

export const safetyKeys = {
  all: ['safety'] as const,
  blocked: () => [...safetyKeys.all, 'blocked'] as const,
};

export function useBlockedUsers() {
  return useQuery({
    queryKey: safetyKeys.blocked(),
    queryFn: safetyService.getBlockedUsers,
  });
}

export function useBlockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
      safetyService.blockUser(userId, reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: safetyKeys.all });
    },
  });
}

export function useReportUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      safetyService.reportUser(userId, reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: safetyKeys.all });
    },
  });
}

export function useUnblockUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => safetyService.unblockUser(userId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: safetyKeys.all });
    },
  });
}
