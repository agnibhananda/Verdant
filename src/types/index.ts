export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: 'waste' | 'energy' | 'sustainable';
  points: number;
  startDate: Date;
  endDate: Date;
  requirements: string[];
  verificationMethod: 'photo' | 'video' | 'peer';
};

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  points: number;
  badge: 'Seedling' | 'Green Warrior' | 'Earth Guardian';
  completedChallenges: string[];
  currentChallenges: string[];
};

export type ChallengeProgress = {
  userId: string;
  challengeId: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'verified';
  proofUrls: string[];
  lastUpdated: Date;
};