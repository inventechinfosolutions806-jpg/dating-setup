import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthSession } from '../store/auth-session.store';

export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
};

export function useCurrentUser() {
  const setUser = useAuthSession((s) => s.setUser);
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      if (user) setUser(user);
      return user;
    },
  });
}

export function useSignIn() {
  const qc = useQueryClient();
  const setUser = useAuthSession((s) => s.setUser);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: (user) => {
      setUser(user);
      void qc.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useSignUp() {
  const qc = useQueryClient();
  const setUser = useAuthSession((s) => s.setUser);
  return useMutation({
    mutationFn: ({ email, password, displayName }: { email: string; password: string; displayName: string }) =>
      authService.signUp(email, password, displayName),
    onSuccess: (user) => {
      setUser(user);
      void qc.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useSignOut() {
  const qc = useQueryClient();
  const setUser = useAuthSession((s) => s.setUser);
  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      setUser(null);
      void qc.clear();
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthSession((s) => s.setUser);
  return useMutation({
    mutationFn: (updates: Record<string, unknown>) => authService.updateProfile(updates),
    onSuccess: (user) => {
      setUser(user);
      void qc.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
