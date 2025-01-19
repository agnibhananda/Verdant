import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Post, Tip, Like } from '../types/database';

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommunityData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData);

        // Fetch tips
        const { data: tipsData, error: tipsError } = await supabase
          .from('tips')
          .select('*')
          .order('created_at', { ascending: false });

        if (tipsError) throw tipsError;
        setTips(tipsData);

        // Fetch user's likes if logged in
        if (user) {
          const { data: likesData, error: likesError } = await supabase
            .from('likes')
            .select('*')
            .eq('user_id', user.id);

          if (likesError) throw likesError;
          setLikes(likesData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch community data');
      } finally {
        setLoading(false);
      }
    }

    fetchCommunityData();
  }, []);

  const createPost = async (title: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title,
          content
        })
        .select()
        .single();

      if (error) throw error;
      setPosts([data, ...posts]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create post' };
    }
  };

  const createTip = async (tip: string, category: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('tips')
        .insert({
          user_id: user.id,
          tip,
          category
        })
        .select()
        .single();

      if (error) throw error;
      setTips([data, ...tips]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to create tip' };
    }
  };

  const toggleLike = async (tipId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const existingLike = likes.find(like => like.tip_id === tipId);

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (error) throw error;
        setLikes(likes.filter(like => like.id !== existingLike.id));
      } else {
        // Like
        const { data, error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            tip_id: tipId
          })
          .select()
          .single();

        if (error) throw error;
        setLikes([...likes, data]);
      }

      // Refresh tips to get updated likes count
      const { data: updatedTip, error: tipError } = await supabase
        .from('tips')
        .select('*')
        .eq('id', tipId)
        .single();

      if (tipError) throw tipError;
      setTips(tips.map(tip => 
        tip.id === tipId ? updatedTip : tip
      ));

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to toggle like' };
    }
  };

  return {
    posts,
    tips,
    likes,
    loading,
    error,
    createPost,
    createTip,
    toggleLike
  };
}