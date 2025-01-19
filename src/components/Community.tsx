import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  Trophy,
  Share2, 
  ThumbsUp,
  Plus,
  Send,
  X,
  Flag,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Calendar,
  Tag,
  Clock,
  AlertTriangle
} from 'lucide-react';
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
  category: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  is_liked: boolean;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportItemId, setReportItemId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPosts();
  }, [sortBy, selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            name,
            avatar_url
          )
        `)
        .limit(location.pathname === '/' ? 3 : 50);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('likes', { ascending: false });
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Get likes for current user
      const user = (await supabase.auth.getUser()).data.user;
      if (user && data) {
        const { data: likes } = await supabase
          .from('likes')
          .select('target_id')
          .eq('user_id', user.id)
          .eq('target_type', 'post');

        const likedPosts = new Set(likes?.map(like => like.target_id));
        
        setPosts(data.map(post => ({
          ...post,
          is_liked: likedPosts.has(post.id),
          user: post.profiles
        })));
      } else {
        setPosts(data?.map(post => ({
          ...post,
          is_liked: false,
          user: post.profiles
        })) || []);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
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
        category: newPost.category,
        user_id: user.id
      });

      if (error) throw error;
      
      setShowNewPostModal(false);
      setNewPost({ title: '', content: '', category: 'general' });
      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const handleLike = async (type: 'post' | 'comment', id: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data: existingLike } = await supabase
        .from('likes')
        .select()
        .eq('user_id', user.id)
        .eq('target_id', id)
        .eq('target_type', type)
        .single();

      if (existingLike) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('target_id', id)
          .eq('target_type', type);
      } else {
        await supabase.from('likes').insert({
          user_id: user.id,
          target_id: id,
          target_type: type
        });
      }

      if (type === 'post') {
        fetchPosts();
      } else {
        const post = posts.find(p => 
          comments[p.id]?.some(c => c.id === id)
        );
        if (post) {
          fetchComments(post.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like item');
    }
  };

  const handleCreateComment = async (postId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const content = newComment[postId];
      if (!content?.trim()) return;

      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        content,
        user_id: user.id
      });

      if (error) throw error;

      setNewComment(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
      fetchPosts(); // Refresh comment counts
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
    }
  };

  const renderPost = (post: Post) => (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.avatar_url}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-eco-primary">{post.user.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
              {post.category && (
                <>
                  <Tag className="h-4 w-4" />
                  <span className="capitalize">{post.category}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleShare('post', post.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setReportItemId(post.id);
              setShowReportModal(true);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Flag className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-eco-primary mb-2">{post.title}</h3>
        <p className="text-gray-700">{post.content}</p>
      </div>

      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={() => handleLike('post', post.id)}
          className={`flex items-center space-x-1 transition-colors ${
            post.is_liked ? 'text-eco-primary' : 'text-gray-400 hover:text-eco-primary'
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{post.likes}</span>
        </button>
        <button
          onClick={() => fetchComments(post.id)}
          className="flex items-center space-x-1 text-gray-400 hover:text-eco-primary transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments_count}</span>
        </button>
      </div>

      {comments[post.id] && (
        <div className="mt-4 space-y-4">
          {comments[post.id].map(comment => (
            <div key={comment.id} className="bg-eco-background rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src={comment.user.avatar_url}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <span className="font-semibold text-eco-primary">{comment.user.name}</span>
                  <div className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
              <button
                onClick={() => handleLike('comment', comment.id)}
                className={`flex items-center space-x-1 mt-2 text-sm transition-colors ${
                  comment.is_liked ? 'text-eco-primary' : 'text-gray-400 hover:text-eco-primary'
                }`}
              >
                <ThumbsUp className="h-3 w-3" />
                <span>{comment.likes}</span>
              </button>
            </div>
          ))}

          <div className="flex items-center space-x-2 mt-4">
            <input
              type="text"
              value={newComment[post.id] || ''}
              onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
              placeholder="Write a comment..."
              className="flex-1 bg-eco-background rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-eco-primary"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreateComment(post.id);
                }
              }}
            />
            <button
              onClick={() => handleCreateComment(post.id)}
              className="bg-eco-primary text-white p-2 rounded-lg hover:bg-eco-secondary transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
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
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {location.pathname !== '/' && (
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-primary"
              />
            </div>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
            className="px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-primary"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-primary"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="tips">Eco Tips</option>
            <option value="challenges">Challenges</option>
            <option value="questions">Questions</option>
          </select>
          <button
            onClick={() => setShowNewPostModal(true)}
            className="bg-eco-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-eco-secondary transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-primary mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading discussions...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No discussions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => renderPost(post))}
        </div>
      )}

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
                  <input
                    type="text"
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-primary"
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Write your post..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-primary h-32"
                  />
                </div>

                <div>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-primary"
                  >
                    <option value="general">General</option>
                    <option value="tips">Eco Tips</option>
                    <option value="challenges">Challenges</option>
                    <option value="questions">Questions</option>
                  </select>
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
                    className="bg-eco-primary text-white px-6 py-2 rounded-lg hover:bg-eco-secondary transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

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
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-primary h-32"
                />

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
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
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
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