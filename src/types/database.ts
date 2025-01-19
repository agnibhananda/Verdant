export type Profile = {
    id: string;
    name: string | null;
    badge: string;
    points: number;
    current_streak: number;
    completed_challenges: number;
    bio: string | null;
    created_at: string;
    updated_at: string;
  };
  
  export type Challenge = {
    id: string;
    title: string;
    description: string;
    category: string;
    points: number;
    difficulty: string;
    verification_method: string;
    requirements: string[];
    start_date: string;
    end_date: string;
    created_at: string;
  };
  
  export type UserChallenge = {
    id: string;
    user_id: string;
    challenge_id: string;
    status: string;
    proof: string | null;
    verified: boolean;
    joined_at: string;
    completed_at: string | null;
  };
  
  export type Post = {
    id: string;
    user_id: string;
    title: string;
    content: string;
    created_at: string;
  };
  
  export type Tip = {
    id: string;
    user_id: string;
    tip: string;
    category: string;
    likes: number;
    created_at: string;
  };
  
  export type Like = {
    id: string;
    user_id: string;
    tip_id: string;
    created_at: string;
  };
  
  export type Database = {
    public: {
      Tables: {
        profiles: {
          Row: Profile;
          Insert: Omit<Profile, 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Profile, 'id'>>;
        };
        challenges: {
          Row: Challenge;
          Insert: Omit<Challenge, 'id' | 'created_at'>;
          Update: Partial<Omit<Challenge, 'id'>>;
        };
        user_challenges: {
          Row: UserChallenge;
          Insert: Omit<UserChallenge, 'id' | 'joined_at'>;
          Update: Partial<Omit<UserChallenge, 'id'>>;
        };
        posts: {
          Row: Post;
          Insert: Omit<Post, 'id' | 'created_at'>;
          Update: Partial<Omit<Post, 'id'>>;
        };
        tips: {
          Row: Tip;
          Insert: Omit<Tip, 'id' | 'created_at' | 'likes'>;
          Update: Partial<Omit<Tip, 'id'>>;
        };
        likes: {
          Row: Like;
          Insert: Omit<Like, 'id' | 'created_at'>;
          Update: Partial<Omit<Like, 'id'>>;
        };
      };
    };
  };