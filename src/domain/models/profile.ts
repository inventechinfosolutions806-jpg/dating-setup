export type RelationshipIntent = 'friendship-first' | 'open-to-romance';

export type CommunicationStyle =
  | 'direct'
  | 'thoughtful'
  | 'playful'
  | 'reserved';

export type ValueTag =
  | 'family'
  | 'creativity'
  | 'ambition'
  | 'kindness'
  | 'adventure'
  | 'stability'
  | 'humor'
  | 'intellect'
  | 'spirituality'
  | 'community';

export type LifestyleTag =
  | 'early-riser'
  | 'night-owl'
  | 'homebody'
  | 'social'
  | 'active'
  | 'relaxed'
  | 'organized'
  | 'spontaneous';

export interface Profile {
  id: string;
  displayName: string;
  age: number;
  bio: string;
  city: string;
  region: string;
  pronouns?: string;
  languages: string[];
  interests: string[];
  relationshipIntent: RelationshipIntent;
  values: ValueTag[];
  lifestyle: LifestyleTag[];
  communicationStyle: CommunicationStyle;
  photoUrl: string;
  gallery?: string[];
  profileCompletion: number;
  isVerified: boolean;
}

export interface Candidate extends Profile {
  compatibilityReasons: string[];
  sharedInterests: string[];
  sharedValues: ValueTag[];
  conversationStarters: string[];
  compatibilityScore: number;
}

export interface CurrentUser extends Profile {
  email: string;
  onboarded: boolean;
}
