import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  comments: Comment[];
  user_vote?: 'up' | 'down' | null;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  parent_id: string | null;
  created_at: string;
  user_vote?: 'up' | 'down' | null;
  replies?: Comment[];
}

export function useForum() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch posts with vote counts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          comments (
            *,
            replies:comments(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // If user is authenticated, fetch their votes
      if (user) {
        const { data: votesData } = await supabase
          .from('votes')
          .select('*')
          .eq('user_id', user.id);

        // Merge user votes with posts
        const postsWithVotes = postsData.map(post => ({
          ...post,
          user_vote: votesData?.find(v => v.post_id === post.id)?.vote_type || null,
          comments: post.comments.map(comment => ({
            ...comment,
            user_vote: votesData?.find(v => v.comment_id === comment.id)?.vote_type || null
          }))
        }));

        setPosts(postsWithVotes);
      } else {
        setPosts(postsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (title: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({ title, content, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setPosts([data, ...posts]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create post' };
    }
  };

  const createComment = async (postId: string, content: string, parentId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          content,
          user_id: user.id,
          parent_id: parentId
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: parentId
              ? post.comments.map(comment => {
                  if (comment.id === parentId) {
                    return {
                      ...comment,
                      replies: [...(comment.replies || []), data]
                    };
                  }
                  return comment;
                })
              : [...post.comments, data]
          };
        }
        return post;
      }));

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create comment' };
    }
  };

  const vote = async (
    type: 'up' | 'down',
    targetId: string,
    targetType: 'post' | 'comment'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq(targetType === 'post' ? 'post_id' : 'comment_id', targetId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === type) {
          // Remove vote if clicking same type
          await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Update vote type if different
          await supabase
            .from('votes')
            .update({ vote_type: type })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            [targetType === 'post' ? 'post_id' : 'comment_id']: targetId,
            vote_type: type
          });
      }

      // Refresh posts to get updated vote counts
      await fetchPosts();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to vote' };
    }
  };

  const report = async (
    targetId: string,
    targetType: 'post' | 'comment',
    reason: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          [targetType === 'post' ? 'post_id' : 'comment_id']: targetId,
          reason
        });

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to submit report' };
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    createComment,
    vote,
    report
  };
}