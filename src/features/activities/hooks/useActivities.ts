import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '../services/activity.service';

export const activityKeys = {
  all: ['activities'] as const,
  list: (connectionId?: string) => [...activityKeys.all, 'list', connectionId ?? 'all'] as const,
  detail: (id: string) => [...activityKeys.all, 'detail', id] as const,
};

export function useActivities(connectionId?: string) {
  return useQuery({
    queryKey: activityKeys.list(connectionId),
    queryFn: () => activityService.getActivities(connectionId),
  });
}

export function useActivity(id: string | undefined) {
  return useQuery({
    queryKey: activityKeys.detail(id ?? ''),
    queryFn: () => activityService.getById(id ?? ''),
    enabled: !!id,
  });
}

export function useStartActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, connectionId }: { id: string; connectionId: string }) =>
      activityService.start(id, connectionId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useSubmitActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ activityId, connectionId, userId, response }: { activityId: string; connectionId: string; userId: string; response: string }) =>
      activityService.submitResponse(activityId, connectionId, userId, response),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
