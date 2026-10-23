import { repositories } from '@/app/composition/repositories';

export const authService = {
  getCurrentUser: () => repositories.auth.getCurrentUser(),
  signIn: (email: string, password: string) => repositories.auth.signIn(email, password),
  signUp: (email: string, password: string, displayName: string) =>
    repositories.auth.signUp(email, password, displayName),
  signOut: () => repositories.auth.signOut(),
  updateProfile: (updates: Record<string, unknown>) =>
    repositories.auth.updateProfile(updates as Parameters<typeof repositories.auth.updateProfile>[0]),
};
