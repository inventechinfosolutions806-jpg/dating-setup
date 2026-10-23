import { repositories } from '@/app/composition/repositories';

export const introductionService = {
  getReceived: () => repositories.introduction.getReceivedIntroductions(),
  getSent: () => repositories.introduction.getSentIntroductions(),
  send: (toUserId: string, message: string) =>
    repositories.introduction.sendIntroduction(toUserId, message),
  updateStatus: (id: string, status: 'pending' | 'accepted' | 'declined' | 'withdrawn') =>
    repositories.introduction.updateStatus(id, status),
  withdraw: (id: string) => repositories.introduction.withdraw(id),
};
