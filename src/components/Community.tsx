import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  Trophy,
  Share2, 
  ThumbsUp,
  ThumbsDown,
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
  AlertTriangle,
  Bookmark,
  Save,
  Award,
  Edit,
  Trash2
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
  dislikes: number;
  comments_count: number;
  is_liked: boolean;
  is_disliked: boolean;
  is_saved: boolean;
  category: string;
  awards: Award[];
  user: {
    name: string;
    avatar_url: string;
    karma: number;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes: number;
  dislikes: number;
  is_liked: boolean;
  is_disliked: boolean;
  parent_id?: string;
  depth: number;
  user: {
    name: string;
    avatar_url: string;
    karma: number;
  };
  replies?: Comment[];
}

interface Award {
  id: string;
  type: string;
  user_id: string;
  created_at: string;
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
  const [sortBy, setSortBy] = useState<'newest' | 'hot' | 'top' | 'controversial'>('hot');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportItemId, setReportItemId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [awardTarget, setAwardTarget] = useState<{ id: string; type: 'post' | 'comment' } | null>(null);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('all');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [userKarma, setUserKarma] = useState<number>(0);
  
  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // Load more posts
        fetchPosts(true);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  useEffect(() => {
    fetchPosts();
    fetchUserKarma();
  }, [sortBy, selectedCategory, searchQuery, timeFilter]);

  const fetchUserKarma = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('karma')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserKarma(data.karma);
    } catch (err) {
      console.error('Error fetching karma:', err);
    }
  };

  const handleVote = async (type: 'post' | 'comment', id: string, value: 1 | -1) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data: existingVote } = await supabase
        .from('votes')
        .select()
        .eq('user_id', user.id)
        .eq('target_id', id)
        .eq('target_type', type)
        .single();

      if (existingVote?.value === value) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('target_id', id)
          .eq('target_type', type);
      } else {
        // Upsert vote
        await supabase
          .from('votes')
          .upsert({
            user_id: user.id,
            target_id: id,
            target_type: type,
            value
          }, {
            onConflict: 'user_id,target_id,target_type'
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
      setError(err instanceof Error ? err.message : 'Failed to vote');
    }
  };

  const handleSave = async (type: 'post' | 'comment', id: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data: existingSave } = await supabase
        .from('saves')
        .select()
        .eq('user_id', user.id)
        .eq('target_id', id)
        .eq('target_type', type)
        .single();

      if (existingSave) {
        await supabase
          .from('saves')
          .delete()
          .eq('user_id', user.id)
          .eq('target_id', id)
          .eq('target_type', type);
      } else {
        await supabase
          .from('saves')
          .insert({
            user_id: user.id,
            target_id: id,
            target_type: type
          });
      }

      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    }
  };

  const handleAward = async (type: 'post' | 'comment', id: string, awardType: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      await supabase
        .from('awards')
        .insert({
          user_id: user.id,
          target_id: id,
          target_type: type,
          award_type: awardType
        });

      setShowAwardModal(false);
      setAwardTarget(null);
      
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
      setError(err instanceof Error ? err.message : 'Failed to give award');
    }
  };

  const handleShare = async (type: 'post' | 'comment', id: string) => {
    try {
      const url = `${window.location.origin}/community/${type}/${id}`;
      await navigator.clipboard.writeText(url);
      // Show success toast
    } catch (err) {
      setError('Failed to copy link');
    }
  };

  const renderComment = (comment: Comment, postId: string) => {
    const marginLeft = comment.depth * 24;
    
    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
        style={{ marginLeft }}
      >
        <div className="bg-eco-background rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={comment.user.avatar_url}
                alt={comment.user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-eco-primary">{comment.user.name}</span>
                  <span className="text-xs text-gray-500">• {comment.user.karma} karma</span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {editingComment === comment.id ? (
                <>
                  <button
                    onClick={() => {
                      handleEditComment(comment.id, postId);
                    }}
                    className="text-eco-primary hover:text-eco-secondary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setEditedContent('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleShare('comment', comment.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setAwardTarget({ id: comment.id, type: 'comment' });
                      setShowAwardModal(true);
                    }}
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    <Award className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setReportItemId(comment.id);
                      setShowReportModal(true);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {editingComment === comment.id ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-primary"
            />
          ) : (
            <p className="text-gray-700 mt-2">{comment.content}</p>
          )}

          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleVote('comment', comment.id, 1)}
                className={`p-1 rounded ${
                  comment.is_liked ? 'bg-eco-primary text-white' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">
                {comment.likes - comment.dislikes}
              </span>
              <button
                onClick={() => handleVote('comment', comment.id, -1)}
                className={`p-1 rounded ${
                  comment.is_disliked ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-gray-400 hover:text-eco-primary text-sm"
            >
              Reply
            </button>

            {comment.user_id === (supabase.auth.getUser())?.data?.user?.id && (
              <>
                <button
                  onClick={() => {
                    setEditingComment(comment.id);
                    setEditedContent(comment.content);
                  }}
                  className="text-gray-400 hover:text-eco-primary text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.id, postId)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-4">
              <textarea
                value={newComment[comment.id] || ''}
                onChange={(e) => setNewComment(prev => ({ ...prev, [comment.id]: e.target.value }))}
                placeholder="Write a reply..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-eco-primary"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateComment(postId, comment.id)}
                  className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary"
                >disabled={!newComment[comment.id]?.trim()}
                  Reply
                </button>
              </div>
            </div>
          )}

          {comment.replies?.map(reply => renderComment(reply, postId))}
        </div>
      </motion.div>
    );
  };

  const handleCreateComment = async (postId: string, parentId?: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const content = parentId ? newComment[parentId] : newComment[postId];
      if (!content?.trim()) return;

      const { data: comment, error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: postId,
          user_id: user.id,
          parent_id: parentId,
          depth: parentId ? 
            (comments[postId]?.find(c => c.id === parentId)?.depth ?? 0) + 1 : 
            0
        })
        .select(`
          *,
          user:profiles(name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setNewComment({});
      setReplyingTo(null);
      await fetchComments(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
    }
  };

  const handleEditComment = async (commentId: string, postId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      if (!editedContent.trim()) return;

      const { error } = await supabase
        .from('comments')
        .update({ content: editedContent })
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setEditingComment(null);
      setEditedContent('');
      await fetchComments(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit comment');
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchComments(postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  const fetchPosts = async (loadMore = false) => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;

      let query = supabase
        .from('posts')
        .select(`
          *,
          user:profiles(name, avatar_url),
          awards(id, type, user_id, created_at),
          comments:comments_count(count)
        `);

      // Apply filters
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      // Apply time filter
      const now = new Date();
      switch (timeFilter) {
        case 'today':
          query = query.gte('created_at', new Date(now.setDate(now.getDate() - 1)).toISOString());
          break;
        case 'week':
          query = query.gte('created_at', new Date(now.setDate(now.getDate() - 7)).toISOString());
          break;
        case 'month':
          query = query.gte('created_at', new Date(now.setDate(now.getDate() - 30)).toISOString());
          break;
        case 'year':
          query = query.gte('created_at', new Date(now.setDate(now.getDate() - 365)).toISOString());
          break;
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'hot':
          query = query.order('comments_count', { ascending: false });
          break;
        case 'top':
          query = query.order('likes', { ascending: false });
          break;
        case 'controversial':
          query = query.order('dislikes', { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (error) throw error;

      setPosts(prev => loadMore ? [...prev, ...data] : data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        <p className="mt-2 text-gray-600">Join the discussion and share your thoughts</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary"
        >
          <option value="hot">Hot</option>
          <option value="newest">Newest</option>
          <option value="top">Top</option>
          <option value="controversial">Controversial</option>
        </select>

        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary"
        >
          <option value="all">All Categories</option>
          <option value="general">General</option>
          <option value="question">Questions</option>
          <option value="discussion">Discussion</option>
          <option value="announcement">Announcements</option>
        </select>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="ml-auto bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Post content */}
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-eco-primary"></div>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Add implementation for NewPostModal, ReportModal, and AwardModal */}
    </div>
  );
};

export default Community;