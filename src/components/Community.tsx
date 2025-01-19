import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Trophy, Share2, ThumbsUp, Plus, Send, X, Flag, Search, Filter, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  comments_count: number;
  is_liked: boolean;
}

interface Tip {
  id: string;
  tip: string;
  category: string;
  likes: number;
  created_at: string;
  user_id: string;
  is_liked: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  is_liked: boolean;
}

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [likedTips, setLikedTips] = useState<string[]>([]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showNewTipModal, setShowNewTipModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newTip, setNewTip] = useState({ tip: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportItemId, setReportItemId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    fetchTips();
    setupRealtime();
  }, [sortBy, selectedCategory]);

  const setupRealtime = () => {
    // ... (keep existing realtime setup)
  };

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .limit(location.pathname === '/' ? 3 : 50);

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('likes', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    }
  };

  const fetchTips = async () => {
    try {
      let query = supabase
        .from('tips')
        .select('*')
        .limit(location.pathname === '/' ? 3 : 50);

      // Apply filters similar to posts
      if (searchQuery) {
        query = query.ilike('tip', `%${searchQuery}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('likes', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setTips(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tips');
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(prev => ({ ...prev, [postId]: data || [] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
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
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const handleCreateComment = async (postId: string, content: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        content,
        user_id: user.id
      });

      if (error) throw error;
      fetchComments(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
    }
  };

  const handleReport = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('reports').insert({
        item_id: reportItemId,
        reason: reportReason,
        user_id: user.id
      });

      if (error) throw error;
      setShowReportModal(false);
      setReportItemId(null);
      setReportReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    }
  };

  const handleShare = async (type: 'post' | 'tip', id: string) => {
    try {
      const url = `${window.location.origin}/community/${type}/${id}`;
      await navigator.clipboard.writeText(url);
      // Show success toast or notification
    } catch (err) {
      setError('Failed to copy link');
    }
  };

  const renderFilters = () => (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-primary focus:border-eco-primary"
          />
        </div>
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-primary focus:border-eco-primary"
      >
        <option value="newest">Newest</option>
        <option value="popular">Most Popular</option>
      </select>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-primary focus:border-eco-primary"
      >
        <option value="all">All Categories</option>
        <option value="energy">Energy</option>
        <option value="water">Water</option>
        <option value="waste">Waste</option>
        <option value="transport">Transport</option>
        <option value="food">Food</option>
      </select>
    </div>
  );

  const renderPost = (post: Post) => (
    <motion.div
      key={post.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b pb-4"
    >
      <div className="flex justify-between items-start">
        <Link
          to={`/community/post/${post.id}`}
          className="hover:text-eco-primary transition-colors"
        >
          <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
        </Link>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleShare('post', post.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setReportItemId(post.id);
              setShowReportModal(true);
            }}
            className="text-gray-400 hover:text-red-500"
          >
            <Flag className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-gray-600">{post.content}</p>
      <div className="flex items-center space-x-4 mt-2">
        <button
          onClick={() => handleLike('post', post.id)}
          className={`flex items-center space-x-1 ${
            post.is_liked ? 'text-eco-primary' : 'text-gray-400'
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{post.likes}</span>
        </button>
        <button
          onClick={() => fetchComments(post.id)}
          className="flex items-center space-x-1 text-gray-400"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments_count}</span>
        </button>
      </div>
      {comments[post.id] && (
        <div className="mt-4 space-y-2">
          {comments[post.id].map(comment => (
            <div key={comment.id} className="bg-eco-background p-3 rounded-lg">
              <p className="text-sm text-gray-600">{comment.content}</p>
              <div className="flex items-center space-x-2 mt-1">
                <button
                  onClick={() => handleLike('comment', comment.id)}
                  className={`flex items-center space-x-1 text-sm ${
                    comment.is_liked ? 'text-eco-primary' : 'text-gray-400'
                  }`}
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span>{comment.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-eco-primary">Community Hub</h2>
        {location.pathname === '/' && (
          <Link
            to="/community"
            className="text-eco-primary hover:text-eco-secondary transition-colors"
          >
            View All
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {location.pathname !== '/' && renderFilters()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <Link
                to="/community/forum"
                className="text-xl font-bold text-eco-primary flex items-center hover:text-eco-secondary transition-colors"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Discussion Forums
              </Link>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="bg-eco-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-eco-secondary transition-colors w-full sm:w-auto justify-center"
              >
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </button>
            </div>

            <div className="space-y-4">
              {posts.map(post => renderPost(post))}
            </div>
          </motion.div>

          {/* ... (keep existing modals) */}
        </div>

        {/* ... (keep existing sidebar) */}
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
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
                <h3 className="text-xl font-bold text-eco-primary">Report Content</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Please explain why you're reporting this content..."
                  className="w-full p-2 border rounded-lg h-32"
                />

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Submit Report
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