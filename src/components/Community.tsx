import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Trophy, Share2, ThumbsUp, Plus, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface Tip {
  id: string;
  tip: string;
  category: string;
  likes: number;
  created_at: string;
  user_id: string;
}

const Community = () => {
  const [likedTips, setLikedTips] = useState<string[]>([]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showNewTipModal, setShowNewTipModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newTip, setNewTip] = useState({ tip: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchTips();
    setupRealtime();
  }, []);

  const setupRealtime = () => {
    const postsSubscription = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => {
        if (payload.eventType === 'INSERT') {
          setPosts(current => [payload.new as Post, ...current]);
        }
      })
      .subscribe();

    const tipsSubscription = supabase
      .channel('tips')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tips' }, payload => {
        if (payload.eventType === 'INSERT') {
          setTips(current => [payload.new as Tip, ...current]);
        } else if (payload.eventType === 'UPDATE') {
          setTips(current =>
            current.map(tip =>
              tip.id === payload.new.id ? { ...tip, ...payload.new } : tip
            )
          );
        }
      })
      .subscribe();

    return () => {
      postsSubscription.unsubscribe();
      tipsSubscription.unsubscribe();
    };
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    }
  };

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTips(data || []);

      // Fetch user's likes
      const { data: likes } = await supabase
        .from('likes')
        .select('tip_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (likes) {
        setLikedTips(likes.map(like => like.tip_id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tips');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('posts').insert({
        title: newPost.title,
        content: newPost.content,
        user_id: user.id
      });

      if (error) throw error;
      setShowNewPostModal(false);
      setNewPost({ title: '', content: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const handleCreateTip = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('tips').insert({
        tip: newTip.tip,
        category: newTip.category,
        user_id: user.id
      });

      if (error) throw error;
      setShowNewTipModal(false);
      setNewTip({ tip: '', category: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tip');
    }
  };

  const handleLikeTip = async (tipId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      if (likedTips.includes(tipId)) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('tip_id', tipId);

        if (error) throw error;
        setLikedTips(current => current.filter(id => id !== tipId));
      } else {
        // Like
        const { error } = await supabase.from('likes').insert({
          user_id: user.id,
          tip_id: tipId
        });

        if (error) throw error;
        setLikedTips(current => [...current, tipId]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update like');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-eco-primary">Community Hub</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h3 className="text-xl font-bold text-eco-primary flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Discussion Forums
              </h3>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="bg-eco-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-eco-secondary transition-colors w-full sm:w-auto justify-center"
              >
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </button>
            </div>

            <div className="space-y-4">
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b pb-4"
                >
                  <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                  <p className="text-gray-600">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h3 className="text-xl font-bold text-eco-primary flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Tip Marketplace
              </h3>
              <button
                onClick={() => setShowNewTipModal(true)}
                className="bg-eco-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-eco-secondary transition-colors w-full sm:w-auto justify-center"
              >
                <Plus className="h-4 w-4" />
                <span>Share Tip</span>
              </button>
            </div>

            <div className="space-y-4">
              {tips.map(tip => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b pb-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-600">{tip.tip}</p>
                      <span className="text-sm text-eco-primary mt-1 inline-block">
                        {tip.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleLikeTip(tip.id)}
                      className={`flex items-center space-x-1 ${
                        likedTips.includes(tip.id)
                          ? 'text-eco-primary'
                          : 'text-gray-400'
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{tip.likes}</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(tip.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4 md:p-6"
          >
            <h3 className="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Top Contributors
            </h3>
            {/* Add top contributors content here */}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-eco-primary">Create New Post</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={e => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-2 border rounded-lg h-32"
                    placeholder="Share your thoughts..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary"
                  >
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showNewTipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-eco-primary">Share a Tip</h3>
                <button
                  onClick={() => setShowNewTipModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip
                  </label>
                  <textarea
                    value={newTip.tip}
                    onChange={e => setNewTip(prev => ({ ...prev, tip: e.target.value }))}
                    className="w-full p-2 border rounded-lg h-32"
                    placeholder="Share your eco-friendly tip..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newTip.category}
                    onChange={e => setNewTip(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select a category</option>
                    <option value="Energy">Energy</option>
                    <option value="Water">Water</option>
                    <option value="Waste">Waste</option>
                    <option value="Transport">Transport</option>
                    <option value="Food">Food</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowNewTipModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTip}
                    className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary"
                  >
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;