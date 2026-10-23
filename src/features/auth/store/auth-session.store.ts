import { create } from 'zustand';
import type { CurrentUser } from '@/domain/models/profile';

interface AuthSessionState {
  user: CurrentUser | null;
  isRestoring: boolean;
  setUser: (user: CurrentUser | null) => void;
  setRestoring: (v: boolean) => void;
}

export const useAuthSession = create<AuthSessionState>((set) => ({
  user: null,
  isRestoring: true,
  setUser: (user) => set({ user, isRestoring: false }),
  setRestoring: (v) => set({ isRestoring: v }),
}));
