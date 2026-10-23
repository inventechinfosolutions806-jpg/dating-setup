import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { introductionService } from '../services/introduction.service';

export const introductionKeys = {
  all: ['introductions'] as const,
  received: () => [...introductionKeys.all, 'received'] as const,
  sent: () => [...introductionKeys.all, 'sent'] as const,
};

export function useReceivedIntroductions() {
  return useQuery({
    queryKey: introductionKeys.received(),
    queryFn: introductionService.getReceived,
  });
}

export function useSentIntroductions() {
  return useQuery({
    queryKey: introductionKeys.sent(),
    queryFn: introductionService.getSent,
  });
}

export function useSendIntroduction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ toUserId, message }: { toUserId: string; message: string }) =>
      introductionService.send(toUserId, message),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: introductionKeys.all });
    },
  });
}

export function useUpdateIntroductionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'accepted' | 'declined' | 'withdrawn' }) =>
      introductionService.updateStatus(id, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: introductionKeys.all });
      void qc.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}

export function useWithdrawIntroduction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => introductionService.withdraw(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: introductionKeys.all });
    },
  });
}
