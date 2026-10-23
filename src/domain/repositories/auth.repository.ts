import type { CurrentUser } from '@/domain/models/profile';

export interface AuthRepository {
  getCurrentUser(): Promise<CurrentUser | null>;
  signIn(email: string, password: string): Promise<CurrentUser>;
  signUp(email: string, password: string, displayName: string): Promise<CurrentUser>;
  signOut(): Promise<void>;
  updateProfile(updates: Partial<CurrentUser>): Promise<CurrentUser>;
}
