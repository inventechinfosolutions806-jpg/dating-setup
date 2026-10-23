export type IntroductionStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'withdrawn';

export interface Introduction {
  id: string;
  fromUserId: string;
  toUserId: string;
  candidate: {
    id: string;
    displayName: string;
    age: number;
    photoUrl: string;
    city: string;
  };
  message: string;
  status: IntroductionStatus;
  createdAt: string;
  sharedInterests: string[];
}
