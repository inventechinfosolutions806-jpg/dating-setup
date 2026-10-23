import type { AuthRepository } from '@/domain/repositories/auth.repository';
import type { CurrentUser } from '@/domain/models/profile';
import { getMockDb, delay } from '../mock-db';
import { UnauthorizedError } from '@/domain/errors/domain-error';

export class MockAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<CurrentUser | null> {
    await delay(200);
    return getMockDb().currentUser;
  }

  async signIn(email: string, _password: string): Promise<CurrentUser> {
    await delay(500);
    if (!email || !email.includes('@')) {
      throw new UnauthorizedError('Invalid email or password');
    }
    return getMockDb().currentUser;
  }

  async signUp(email: string, _password: string, displayName: string): Promise<CurrentUser> {
    await delay(600);
    if (!email || !email.includes('@')) {
      throw new UnauthorizedError('Invalid email');
    }
    const db = getMockDb();
    db.currentUser = {
      ...db.currentUser,
      email,
      displayName,
      onboarded: false,
    };
    return db.currentUser;
  }

  async signOut(): Promise<void> {
    await delay(200);
  }

  async updateProfile(updates: Partial<CurrentUser>): Promise<CurrentUser> {
    await delay(400);
    const db = getMockDb();
    db.currentUser = { ...db.currentUser, ...updates };
    return db.currentUser;
  }
}
