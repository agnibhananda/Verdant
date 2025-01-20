export interface ForumPost {
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    likes: number;
    tags: string[];
    isLiked?: boolean;
    author?: {
      name: string;
      avatar: string;
    };
  }
  
  export interface ForumComment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    likes: number;
    author?: {
      name: string;
      avatar: string;
    };
  }
  
  export interface PostLike {
    post_id: string;
    user_id: string;
    created_at: string;
  }