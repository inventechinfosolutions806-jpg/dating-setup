import type { CurrentUser, Candidate, Profile } from '@/domain/models/profile';

const womenPhotos = [
  'https://images.pexels.com/photos/2530364/pexels-photo-2530364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/32222185/pexels-photo-32222185.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/4045708/pexels-photo-4045708.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/29991205/pexels-photo-29991205.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/28582416/pexels-photo-28582416.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/16471284/pexels-photo-16471284.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/15022582/pexels-photo-15022582.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/1104758/pexels-photo-1104758.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/18355488/pexels-photo-18355488.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/36486926/pexels-photo-36486926.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

const menPhotos = [
  'https://images.pexels.com/photos/12871465/pexels-photo-12871465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/11650513/pexels-photo-11650513.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/28831258/pexels-photo-28831258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/18963011/pexels-photo-18963011.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/35401446/pexels-photo-35401446.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/10325975/pexels-photo-10325975.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/17849411/pexels-photo-17849411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/18653132/pexels-photo-18653132.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/31190504/pexels-photo-31190504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/16090359/pexels-photo-16090359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/37692080/pexels-photo-37692080.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/31705700/pexels-photo-31705700.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export const allPhotos = { womenPhotos, menPhotos };

export const mockCurrentUser: CurrentUser = {
  id: 'user-001',
  email: 'alex@mirror.app',
  displayName: 'Alex',
  age: 29,
  bio: 'Curious about people and ideas. I value honesty, humor, and a good walk. Looking to build genuine connections first.',
  city: 'Brooklyn',
  region: 'New York',
  pronouns: 'they/them',
  languages: ['English', 'Spanish'],
  interests: ['reading', 'hiking', 'cooking', 'philosophy', 'indie music', 'photography'],
  relationshipIntent: 'friendship-first',
  values: ['kindness', 'creativity', 'humor', 'intellect'],
  lifestyle: ['early-riser', 'active', 'organized'],
  communicationStyle: 'thoughtful',
  photoUrl: womenPhotos[0],
  gallery: [womenPhotos[0], womenPhotos[1], womenPhotos[2]],
  profileCompletion: 85,
  isVerified: true,
  onboarded: true,
};

interface RawProfile {
  id: string;
  displayName: string;
  age: number;
  bio: string;
  city: string;
  region: string;
  pronouns?: string;
  languages: string[];
  interests: string[];
  relationshipIntent: 'friendship-first' | 'open-to-romance';
  values: Profile['values'];
  lifestyle: Profile['lifestyle'];
  communicationStyle: Profile['communicationStyle'];
  photoUrl: string;
  gallery?: string[];
}

const rawProfiles: RawProfile[] = [
  {
    id: 'cand-001',
    displayName: 'Maya',
    age: 27,
    bio: 'Bookstore wanderer and weekend baker. I believe the best conversations happen over coffee and shared silence.',
    city: 'Brooklyn',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'French'],
    interests: ['reading', 'cooking', 'philosophy', 'indie music', 'baking'],
    relationshipIntent: 'friendship-first',
    values: ['kindness', 'creativity', 'humor', 'intellect'],
    lifestyle: ['early-riser', 'homebody', 'organized'],
    communicationStyle: 'thoughtful',
    photoUrl: womenPhotos[1],
    gallery: [womenPhotos[1], womenPhotos[2]],
  },
  {
    id: 'cand-002',
    displayName: 'James',
    age: 31,
    bio: 'Software engineer by day, amateur guitarist by night. I prefer mountains over malls and deep talks over small talk.',
    city: 'Queens',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English'],
    interests: ['hiking', 'indie music', 'photography', 'philosophy', 'technology'],
    relationshipIntent: 'open-to-romance',
    values: ['ambition', 'humor', 'adventure', 'intellect'],
    lifestyle: ['night-owl', 'active', 'spontaneous'],
    communicationStyle: 'playful',
    photoUrl: menPhotos[0],
    gallery: [menPhotos[0], menPhotos[1]],
  },
  {
    id: 'cand-003',
    displayName: 'Sofia',
    age: 26,
    bio: 'Designer and plant parent. I find beauty in small details and believe kindness is underrated.',
    city: 'Manhattan',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'Italian'],
    interests: ['cooking', 'photography', 'reading', 'art', 'gardening'],
    relationshipIntent: 'friendship-first',
    values: ['creativity', 'kindness', 'community', 'stability'],
    lifestyle: ['homebody', 'relaxed', 'organized'],
    communicationStyle: 'reserved',
    photoUrl: womenPhotos[2],
    gallery: [womenPhotos[2], womenPhotos[3]],
  },
  {
    id: 'cand-004',
    displayName: 'Daniel',
    age: 33,
    bio: 'Therapist who believes everyone deserves to be heard. I love long walks, longer books, and honest people.',
    city: 'Brooklyn',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English', 'Portuguese'],
    interests: ['reading', 'philosophy', 'hiking', 'cooking', 'psychology'],
    relationshipIntent: 'friendship-first',
    values: ['kindness', 'intellect', 'spirituality', 'community'],
    lifestyle: ['early-riser', 'relaxed', 'organized'],
    communicationStyle: 'thoughtful',
    photoUrl: menPhotos[2],
    gallery: [menPhotos[2], menPhotos[3]],
  },
  {
    id: 'cand-005',
    displayName: 'Priya',
    age: 28,
    bio: 'Architect with a weakness for old buildings and new ideas. I collect records and good stories.',
    city: 'Manhattan',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'Hindi'],
    interests: ['indie music', 'photography', 'art', 'reading', 'architecture'],
    relationshipIntent: 'open-to-romance',
    values: ['creativity', 'ambition', 'intellect', 'adventure'],
    lifestyle: ['night-owl', 'social', 'spontaneous'],
    communicationStyle: 'direct',
    photoUrl: womenPhotos[3],
    gallery: [womenPhotos[3], womenPhotos[4]],
  },
  {
    id: 'cand-006',
    displayName: 'Marcus',
    age: 30,
    bio: 'Chef who cooks with intention. Food is my love language, but I also appreciate a quiet evening with a book.',
    city: 'Queens',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English', 'Spanish'],
    interests: ['cooking', 'reading', 'hiking', 'travel'],
    relationshipIntent: 'friendship-first',
    values: ['family', 'kindness', 'creativity', 'stability'],
    lifestyle: ['night-owl', 'social', 'spontaneous'],
    communicationStyle: 'playful',
    photoUrl: menPhotos[4],
    gallery: [menPhotos[4], menPhotos[5]],
  },
  {
    id: 'cand-007',
    displayName: 'Elena',
    age: 25,
    bio: 'PhD student in environmental science. I care deeply about the planet and the people on it.',
    city: 'Brooklyn',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'Greek'],
    interests: ['hiking', 'reading', 'photography', 'activism', 'cooking'],
    relationshipIntent: 'friendship-first',
    values: ['community', 'kindness', 'intellect', 'adventure'],
    lifestyle: ['early-riser', 'active', 'organized'],
    communicationStyle: 'direct',
    photoUrl: womenPhotos[5],
    gallery: [womenPhotos[5], womenPhotos[6]],
  },
  {
    id: 'cand-008',
    displayName: 'Theo',
    age: 32,
    bio: 'Filmmaker and coffee snob. I believe stories connect us and a good espresso can fix most things.',
    city: 'Manhattan',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English'],
    interests: ['photography', 'indie music', 'art', 'film', 'travel'],
    relationshipIntent: 'open-to-romance',
    values: ['creativity', 'humor', 'adventure', 'ambition'],
    lifestyle: ['night-owl', 'social', 'spontaneous'],
    communicationStyle: 'playful',
    photoUrl: menPhotos[6],
    gallery: [menPhotos[6], menPhotos[7]],
  },
  {
    id: 'cand-009',
    displayName: 'Nadia',
    age: 29,
    bio: 'Yoga teacher and amateur poet. I value presence over productivity and depth over breadth.',
    city: 'Queens',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'Arabic'],
    interests: ['reading', 'hiking', 'meditation', 'writing', 'indie music'],
    relationshipIntent: 'friendship-first',
    values: ['spirituality', 'kindness', 'stability', 'humor'],
    lifestyle: ['early-riser', 'relaxed', 'organized'],
    communicationStyle: 'thoughtful',
    photoUrl: womenPhotos[6],
    gallery: [womenPhotos[6], womenPhotos[7]],
  },
  {
    id: 'cand-010',
    displayName: 'Oliver',
    age: 28,
    bio: 'Music producer and dog dad. I make playlists for every mood and believe loyalty is the foundation of any relationship.',
    city: 'Brooklyn',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English'],
    interests: ['indie music', 'cooking', 'photography', 'travel', 'dogs'],
    relationshipIntent: 'friendship-first',
    values: ['family', 'humor', 'kindness', 'stability'],
    lifestyle: ['night-owl', 'homebody', 'spontaneous'],
    communicationStyle: 'playful',
    photoUrl: menPhotos[7],
    gallery: [menPhotos[7], menPhotos[8]],
  },
  {
    id: 'cand-011',
    displayName: 'Aisha',
    age: 30,
    bio: 'Journalist who asks too many questions. I love learning what makes people tick over a good meal.',
    city: 'Manhattan',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'Swahili'],
    interests: ['reading', 'cooking', 'philosophy', 'travel', 'politics'],
    relationshipIntent: 'open-to-romance',
    values: ['intellect', 'ambition', 'community', 'kindness'],
    lifestyle: ['early-riser', 'social', 'organized'],
    communicationStyle: 'direct',
    photoUrl: womenPhotos[7],
    gallery: [womenPhotos[7], womenPhotos[8]],
  },
  {
    id: 'cand-012',
    displayName: 'Liam',
    age: 27,
    bio: 'Teacher and basketball coach. I believe in showing up for people and making them laugh while doing it.',
    city: 'Queens',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English'],
    interests: ['hiking', 'indie music', 'cooking', 'sports', 'reading'],
    relationshipIntent: 'friendship-first',
    values: ['family', 'humor', 'community', 'kindness'],
    lifestyle: ['early-riser', 'active', 'spontaneous'],
    communicationStyle: 'playful',
    photoUrl: menPhotos[8],
    gallery: [menPhotos[8], menPhotos[9]],
  },
  {
    id: 'cand-013',
    displayName: 'Clara',
    age: 32,
    bio: 'Visual artist and gallery curator. I see the world in colors and think vulnerability is a strength.',
    city: 'Brooklyn',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'German'],
    interests: ['art', 'photography', 'reading', 'indie music', 'travel'],
    relationshipIntent: 'open-to-romance',
    values: ['creativity', 'intellect', 'humor', 'adventure'],
    lifestyle: ['night-owl', 'social', 'spontaneous'],
    communicationStyle: 'thoughtful',
    photoUrl: womenPhotos[8],
    gallery: [womenPhotos[8], womenPhotos[9]],
  },
  {
    id: 'cand-014',
    displayName: 'Sebastian',
    age: 34,
    bio: 'Architect turned woodworker. I make furniture and bad puns. Looking for someone to share slow Sundays with.',
    city: 'Manhattan',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English', 'Swedish'],
    interests: ['cooking', 'reading', 'hiking', 'woodworking', 'photography'],
    relationshipIntent: 'friendship-first',
    values: ['stability', 'creativity', 'family', 'humor'],
    lifestyle: ['early-riser', 'homebody', 'organized'],
    communicationStyle: 'reserved',
    photoUrl: menPhotos[9],
    gallery: [menPhotos[9], menPhotos[10]],
  },
  {
    id: 'cand-015',
    displayName: 'Yuki',
    age: 26,
    bio: 'Game designer and ramen enthusiast. I love co-op games, quiet cafes, and conversations that go deep fast.',
    city: 'Queens',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'Japanese'],
    interests: ['indie music', 'art', 'reading', 'gaming', 'cooking'],
    relationshipIntent: 'friendship-first',
    values: ['creativity', 'humor', 'intellect', 'kindness'],
    lifestyle: ['night-owl', 'homebody', 'spontaneous'],
    communicationStyle: 'playful',
    photoUrl: womenPhotos[9],
    gallery: [womenPhotos[9]],
  },
  {
    id: 'cand-016',
    displayName: 'Rafael',
    age: 29,
    bio: 'Marine biologist and avid swimmer. I love the ocean, rainy days, and people who care about something bigger than themselves.',
    city: 'Brooklyn',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English', 'Spanish'],
    interests: ['hiking', 'photography', 'reading', 'activism', 'swimming'],
    relationshipIntent: 'friendship-first',
    values: ['adventure', 'community', 'kindness', 'intellect'],
    lifestyle: ['early-riser', 'active', 'organized'],
    communicationStyle: 'direct',
    photoUrl: menPhotos[10],
    gallery: [menPhotos[10], menPhotos[11]],
  },
  {
    id: 'cand-017',
    displayName: 'Hannah',
    age: 31,
    bio: 'Nonprofit director who believes small acts create big change. I love dinner parties and dancing badly.',
    city: 'Manhattan',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English'],
    interests: ['cooking', 'indie music', 'reading', 'activism', 'travel'],
    relationshipIntent: 'open-to-romance',
    values: ['community', 'kindness', 'ambition', 'humor'],
    lifestyle: ['early-riser', 'social', 'organized'],
    communicationStyle: 'direct',
    photoUrl: menPhotos[11],
    gallery: [menPhotos[11]],
  },
  {
    id: 'cand-018',
    displayName: 'Ben',
    age: 28,
    bio: 'Stand-up comedian and part-time philosopher. I take comedy seriously and everything else with a grain of salt.',
    city: 'Queens',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English'],
    interests: ['indie music', 'reading', 'philosophy', 'comedy', 'cooking'],
    relationshipIntent: 'friendship-first',
    values: ['humor', 'intellect', 'creativity', 'adventure'],
    lifestyle: ['night-owl', 'social', 'spontaneous'],
    communicationStyle: 'playful',
    photoUrl: menPhotos[1],
    gallery: [menPhotos[1]],
  },
  {
    id: 'cand-019',
    displayName: 'Iris',
    age: 27,
    bio: 'Botanist and tea ceremony practitioner. I find joy in slow rituals and listening without an agenda.',
    city: 'Brooklyn',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'Korean'],
    interests: ['reading', 'cooking', 'gardening', 'hiking', 'meditation'],
    relationshipIntent: 'friendship-first',
    values: ['spirituality', 'kindness', 'stability', 'creativity'],
    lifestyle: ['early-riser', 'homebody', 'relaxed'],
    communicationStyle: 'reserved',
    photoUrl: womenPhotos[0],
    gallery: [womenPhotos[0], womenPhotos[1]],
  },
  {
    id: 'cand-020',
    displayName: 'Felix',
    age: 30,
    bio: 'Architect and urban planner. I design public spaces and believe cities should feel like home for everyone.',
    city: 'Manhattan',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English', 'French'],
    interests: ['photography', 'reading', 'art', 'hiking', 'architecture'],
    relationshipIntent: 'open-to-romance',
    values: ['ambition', 'creativity', 'community', 'intellect'],
    lifestyle: ['early-riser', 'active', 'organized'],
    communicationStyle: 'thoughtful',
    photoUrl: menPhotos[3],
    gallery: [menPhotos[3]],
  },
  {
    id: 'cand-021',
    displayName: 'Zara',
    age: 33,
    bio: 'Pediatrician and jazz lover. I spend my days with kids and my evenings with vinyl records. Kindness is my north star.',
    city: 'Queens',
    region: 'New York',
    pronouns: 'she/her',
    languages: ['English', 'Urdu'],
    interests: ['indie music', 'reading', 'cooking', 'travel', 'philosophy'],
    relationshipIntent: 'friendship-first',
    values: ['kindness', 'family', 'stability', 'humor'],
    lifestyle: ['early-riser', 'social', 'organized'],
    communicationStyle: 'thoughtful',
    photoUrl: womenPhotos[4],
    gallery: [womenPhotos[4], womenPhotos[5]],
  },
  {
    id: 'cand-022',
    displayName: 'Tom',
    age: 26,
    bio: 'Software developer and mountain biker. I like clean code, muddy trails, and people who say what they mean.',
    city: 'Brooklyn',
    region: 'New York',
    pronouns: 'he/him',
    languages: ['English'],
    interests: ['hiking', 'photography', 'technology', 'indie music', 'cooking'],
    relationshipIntent: 'friendship-first',
    values: ['adventure', 'humor', 'ambition', 'stability'],
    lifestyle: ['early-riser', 'active', 'spontaneous'],
    communicationStyle: 'direct',
    photoUrl: menPhotos[5],
    gallery: [menPhotos[5]],
  },
];

const userInterests = new Set(mockCurrentUser.interests);
const userValues = new Set(mockCurrentUser.values);

function computeSharedInterests(candidate: RawProfile): string[] {
  return candidate.interests.filter((i) => userInterests.has(i));
}

function computeSharedValues(candidate: RawProfile): Profile['values'] {
  return candidate.values.filter((v) => userValues.has(v));
}

function computeCompatibilityScore(candidate: RawProfile): number {
  const sharedInterests = computeSharedInterests(candidate);
  const sharedValues = computeSharedValues(candidate);
  let score = 40;
  score += sharedInterests.length * 8;
  score += sharedValues.length * 7;
  if (candidate.relationshipIntent === mockCurrentUser.relationshipIntent) score += 10;
  if (candidate.communicationStyle === mockCurrentUser.communicationStyle) score += 5;
  const ageDiff = Math.abs(candidate.age - mockCurrentUser.age);
  if (ageDiff <= 3) score += 8;
  else if (ageDiff <= 5) score += 4;
  if (candidate.languages.some((l) => mockCurrentUser.languages.includes(l))) score += 3;
  return Math.min(score, 98);
}

function computeReasons(candidate: RawProfile): string[] {
  const reasons: string[] = [];
  const sharedInterests = computeSharedInterests(candidate);
  const sharedValues = computeSharedValues(candidate);

  if (sharedInterests.length >= 3) {
    reasons.push(`You both love ${sharedInterests.slice(0, 3).join(', ')} — plenty of natural conversation starters.`);
  } else if (sharedInterests.length > 0) {
    reasons.push(`You share an interest in ${sharedInterests.join(' and ')}.`);
  }

  if (sharedValues.length >= 2) {
    reasons.push(`Your core values align — you both prioritize ${sharedValues.slice(0, 2).join(' and ')}.`);
  } else if (sharedValues.length > 0) {
    reasons.push(`You both value ${sharedValues[0]}.`);
  }

  if (candidate.relationshipIntent === mockCurrentUser.relationshipIntent) {
    reasons.push(
      candidate.relationshipIntent === 'friendship-first'
        ? 'You are both seeking friendship first, with no pressure for romance.'
        : 'You are both open to romance, while valuing a foundation of friendship.',
    );
  }

  if (candidate.communicationStyle === mockCurrentUser.communicationStyle) {
    reasons.push(`You both lean toward ${candidate.communicationStyle} communication, which can reduce misunderstandings.`);
  }

  const ageDiff = Math.abs(candidate.age - mockCurrentUser.age);
  if (ageDiff <= 3) {
    reasons.push('You are close in age, which often means similar life-stage experiences.');
  }

  if (candidate.languages.some((l) => mockCurrentUser.languages.includes(l) && l !== 'English')) {
    reasons.push('You share a second language, which can create a unique cultural connection.');
  }

  return reasons.length > 0 ? reasons : ['You may discover unexpected common ground through conversation.'];
}

function computeConversationStarters(candidate: RawProfile): string[] {
  const starters: string[] = [];
  const sharedInterests = computeSharedInterests(candidate);

  if (sharedInterests.includes('reading')) {
    starters.push('What book changed how you see the world?');
  }
  if (sharedInterests.includes('cooking')) {
    starters.push('What is your signature dish, and who taught you to make it?');
  }
  if (sharedInterests.includes('hiking')) {
    starters.push('What is the most memorable trail you have ever been on?');
  }
  if (sharedInterests.includes('indie music')) {
    starters.push('Which artist do you think more people should know about?');
  }
  if (sharedInterests.includes('photography')) {
    starters.push('What is a moment you wish you had captured but did not?');
  }

  if (starters.length === 0) {
    starters.push('What is something you are curious about right now?');
    starters.push('What does a perfect Sunday look like for you?');
  }

  return starters.slice(0, 3);
}

export const mockCandidates: Candidate[] = rawProfiles.map((rp) => ({
  ...rp,
  profileCompletion: 100,
  isVerified: false,
  sharedInterests: computeSharedInterests(rp),
  sharedValues: computeSharedValues(rp),
  compatibilityReasons: computeReasons(rp),
  conversationStarters: computeConversationStarters(rp),
  compatibilityScore: computeCompatibilityScore(rp),
}));
