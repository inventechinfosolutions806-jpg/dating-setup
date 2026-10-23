import type { Introduction, IntroductionStatus } from '@/domain/models/introduction';

export interface IntroductionRepository {
  getReceivedIntroductions(): Promise<Introduction[]>;
  getSentIntroductions(): Promise<Introduction[]>;
  sendIntroduction(toUserId: string, message: string): Promise<Introduction>;
  updateStatus(id: string, status: IntroductionStatus): Promise<Introduction>;
  withdraw(id: string): Promise<void>;
}
