import React, { useState, useCallback, useRef } from 'react';
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
import { cn } from '../lib/utils';

interface User {
  name: string;
  avatar_url: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user: User;
  likes: number;
  dislikes: number;
  comments_count: number;
  is_liked: boolean;
  is_disliked: boolean;
  is_saved: boolean;
  category: string;
  awards: Award[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: User;
  likes: number;
  dislikes: number;
  is_liked: boolean;
  is_disliked: boolean;
  parent_id?: string;
  depth: number;
  replies?: Comment[];
}

interface Award {
  id: string;
  type: string;
  user_id: string;
  created_at: string;
}

// Mock post data (replace with your actual data fetching logic)
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Sustainable Living Tips',
    content: 'Reduce, reuse, recycle!  Here are some simple ways to make a difference...',
    created_at: '2024-03-08T10:00:00Z',
    user: { name: 'John Doe', avatar_url: '/avatar.jpg' },
    likes: 15,
    dislikes: 2,
    comments_count: 5,
    is_liked: false,
    is_disliked: false,
    is_saved: false,
    category: 'general',
    awards: []
  },
  {
    id: '2',
    title: 'Question about composting',
    content: 'I\'m new to composting. Any tips for beginners?',
    created_at: '2024-03-07T14:30:00Z',
    user: { name: 'Jane Smith', avatar_url: '/avatar.jpg' },
    likes: 8,
    dislikes: 0,
    comments_count: 2,
    is_liked: false,
    is_disliked: false,
    is_saved: false,
    category: 'question',
    awards: []
  },
  // Add more mock posts as needed
];

const Community = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(false);
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
  
  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // Load more posts (mock implementation)
        setPosts(prevPosts => [...prevPosts, ...mockPosts.slice(0, 3)]);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  const handleVote = (type: 'post' | 'comment', id: string, value: 1 | -1) => {
    // Mock implementation
    if (type === 'post') {
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === id
            ? { ...post, likes: post.likes + (value === 1 ? 1 : 0), dislikes: post.dislikes + (value === -1 ? 1 : 0), is_liked: value === 1, is_disliked: value === -1 }
            : post
        )
      );
    } else {
      setComments(prevComments => {
        const updatedComments = { ...prevComments };
        for (const postId in updatedComments) {
          updatedComments[postId] = updatedComments[postId].map(comment =>
            comment.id === id
              ? { ...comment, likes: comment.likes + (value === 1 ? 1 : 0), dislikes: comment.dislikes + (value === -1 ? 1 : 0), is_liked: value === 1, is_disliked: value === -1 }
              : comment
          );
        }
        return updatedComments;
      });
    }
  };

  const handleSave = (type: 'post' | 'comment', id: string) => {
    if (type === 'post') {
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === id ? { ...post, is_saved: !post.is_saved } : post
        )
      );
    } else {
      setComments(prevComments => {
        const updatedComments = { ...prevComments };
        for (const postId in updatedComments) {
          updatedComments[postId] = updatedComments[postId].map(comment =>
            comment.id === id ? { ...comment, is_saved: !comment.is_saved } : comment
          );
        }
        return updatedComments;
      });
    }
  };

  const handleAward = (type: 'post' | 'comment', id: string, awardType: string) => {
    // Mock implementation
    setShowAwardModal(false);
    setAwardTarget(null);
  };

  const handleShare = (type: 'post' | 'comment', id: string) => {
    // Mock implementation
    console.log(`Share ${type} with id: ${id}`);
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

            {comment.user_id === 'mock-user-id' && (
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
                >
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

  const handleCreateComment = (postId: string, parentId?: string) => {
    // Mock implementation
    const content = parentId ? newComment[parentId] : newComment[postId];
    if (!content?.trim()) return;

    const newCommentData = {
      id: Math.random().toString(36).substring(2, 15),
      content,
      created_at: new Date().toISOString(),
      user: { name: 'Mock User', avatar_url: '/avatar.jpg' },
      likes: 0,
      dislikes: 0,
      is_liked: false,
      is_disliked: false,
      parent_id: parentId,
      depth: parentId ? (comments[postId]?.find(c => c.id === parentId)?.depth ?? 0) + 1 : 0,
      replies: []
    };

    setComments(prevComments => {
      const updatedComments = { ...prevComments };
      if (parentId) {
        const parentComment = updatedComments[postId]?.find(c => c.id === parentId);
        if (parentComment) {
          parentComment.replies = [...(parentComment.replies || []), newCommentData];
        }
      } else {
        updatedComments[postId] = [...(updatedComments[postId] || []), newCommentData];
      }
      return updatedComments;
    });

    setNewComment({});
    setReplyingTo(null);
  };

  const handleEditComment = (commentId: string, postId: string) => {
    // Mock implementation
    setComments(prevComments => {
      const updatedComments = { ...prevComments };
      for (const postId in updatedComments) {
        updatedComments[postId] = updatedComments[postId].map(comment =>
          comment.id === commentId ? { ...comment, content: editedContent } : comment
        );
      }
      return updatedComments;
    });
    setEditingComment(null);
    setEditedContent('');
  };

  const handleDeleteComment = (commentId: string, postId: string) => {
    // Mock implementation
    setComments(prevComments => {
      const updatedComments = { ...prevComments };
      for (const postId in updatedComments) {
        updatedComments[postId] = updatedComments[postId].filter(comment => comment.id !== commentId);
      }
      return updatedComments;
    });
  };

  const fetchPosts = (loadMore = false) => {
    // Mock implementation
    setLoading(false);
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
          >
            {renderPost(post)}
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-eco-primary"></div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-eco-primary mb-4">Create New Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary h-32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary"
                  >
                    <option value="general">General</option>
                    <option value="question">Question</option>
                    <option value="discussion">Discussion</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setPosts(prevPosts => [
                        {
                          id: Math.random().toString(36).substring(2, 15),
                          title: newPost.title,
                          content: newPost.content,
                          created_at: new Date().toISOString(),
                          user: { name: 'Mock User', avatar_url: '/avatar.jpg' },
                          likes: 0,
                          dislikes: 0,
                          comments_count: 0,
                          is_liked: false,
                          is_disliked: false,
                          is_saved: false,
                          category: newPost.category,
                          awards: []
                        },
                        ...prevPosts
                      ]);
                      setShowNewPostModal(false);
                      setNewPost({ title: '', content: '', category: 'general' });
                    }}
                    className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary"
                  >
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-eco-primary mb-4">Report Content</h3>
              <div className="space-y-4">
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for reporting..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary h-32"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setReportReason('');
                      setReportItemId(null);
                    }}
                    className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAwardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAwardModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-eco-primary mb-4">Give an Award</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {['helpful', 'insightful', 'inspiring'].map(awardType => (
                    <button
                      key={awardType}
                      onClick={() => {
                        if (awardTarget) {
                          handleAward(awardTarget.type, awardTarget.id, awardType);
                        }
                      }}
                      className="bg-eco-background p-4 rounded-lg hover:bg-eco-accent/20 transition-colors"
                    >
                      <span className="capitalize">{awardType}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAwardModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
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
