import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Trophy,
  Share2, 
  ThumbsUp,
  Plus,
  Search,
  Filter,
  ArrowUp,
  Award,
  Lightbulb,
  Star,
  Heart,
  BookOpen,
  X,
  Send
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ForumPost, ForumComment } from '../types/forum';

const Community = () => {
  const [activeTab, setActiveTab] = useState<'forum' | 'tips' | 'contributors'>('forum');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          post_likes (
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.contains('tags', [selectedCategory]);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const { data: { user } } = await supabase.auth.getUser();

      const postsWithLikes = data?.map(post => ({
        ...post,
        isLiked: post.post_likes?.some(like => like.user_id === user?.id)
      }));

      setPosts(postsWithLikes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          title: newPost.title,
          content: newPost.content,
          tags: newPost.tags,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      setShowNewPostModal(false);
      setNewPost({ title: '', content: '', tags: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating post');
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .match({ post_id: postId, user_id: user.id });
      } else {
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
      }

      setPosts(prev .map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !isLiked
          };
        }
        return post;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating like');
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching comments');
    }
  };

  const handleAddComment = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment
        })
        .select()
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      setNewComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding comment');
    }
  };

  const renderNewPostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-4 md:p-6 max-w-lg w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg md:text-xl font-bold text-eco-primary">Create New Post</h3>
          <button
            onClick={() => setShowNewPostModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Post title"
            value={newPost.title}
            onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-eco-primary text-sm md:text-base"
          />

          <textarea
            placeholder="Write your post..."
            value={newPost.content}
            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
            className="w-full p-2 border rounded-lg h-24 md:h-32 focus:ring-2 focus:ring-eco-primary text-sm md:text-base"
          />

          <div>
            <input
              type="text"
              placeholder="Add tags (comma separated)"
              onChange={(e) => setNewPost(prev => ({
                ...prev,
                tags: e.target.value.split(',').map(tag => tag.trim())
              }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-eco-primary text-sm md:text-base"
            />
          </div>

          <button
            onClick={handleCreatePost}
            className="w-full bg-eco-primary text-white py-2 rounded-lg hover:bg-eco-secondary text-sm md:text-base"
          >
            Create Post
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderPostDetails = () => {
    if (!selectedPost) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg md:text-xl font-bold text-eco-primary">{selectedPost.title}</h3>
            <button
              onClick={() => setSelectedPost(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm md:text-base text-gray-600">{selectedPost.content}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-eco-background rounded-full text-xs text-eco-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-eco-primary text-sm md:text-base">Comments</h4>
            {comments.map((comment) => (
              <div key={comment.id} className="bg-eco-background p-3 md:p-4 rounded-lg">
                <p className="text-sm md:text-base text-gray-600">{comment.content}</p>
                <div className="mt-2 text-xs md:text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-eco-primary text-sm md:text-base"
              />
              <button
                onClick={() => handleAddComment(selectedPost.id)}
                className="bg-eco-primary text-white p-2 rounded-lg hover:bg-eco-secondary"
              >
                <Send className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderForum = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary text-sm md:text-base"
          />
        </div>
        <button
          onClick={() => setShowNewPostModal(true)}
          className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-sm md:text-base">New Discussion</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-eco-primary mx-auto"></div>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Loading posts...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-lg shadow-md p-4 md:p-6 cursor-pointer"
              onClick={() => {
                setSelectedPost(post);
                fetchComments(post.id);
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-eco-primary text-sm md:text-base">{post.title}</h3>
                  <div className="text-xs md:text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLikePost(post.id, post.isLiked || false);
                  }}
                  className={`flex items-center space-x-1 ${
                    post.isLiked ? 'text-eco-primary' : 'text-gray-400'
                  } hover:text-eco-primary`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-xs md:text-sm">{post.likes}</span>
                </button>
              </div>
              <p className="mt-2 text-gray-600 line-clamp-2 text-sm md:text-base">{post.content}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-eco-background rounded-full text-xs text-eco-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-eco-primary">Community</h1>
        <p className="mt-2 text-sm md:text-base text-gray-600">Connect, share, and learn with fellow eco-warriors</p>
      </div>

      <div className="flex space-x-1 bg-eco-background p-1 rounded-lg mb-6 md:mb-8">
        <button
          onClick={() => setActiveTab('forum')}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'forum'
              ? 'bg-white text-eco-primary shadow-sm'
              : 'text-gray-600 hover:text-eco-primary'
          }`}
        >
          <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-sm md:text-base">Forum</span>
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'tips'
              ? 'bg-white text-eco-primary shadow-sm'
              : 'text-gray-600 hover:text-eco-primary'
          }`}
        >
          <Lightbulb className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-sm md:text-base">Tips Marketplace</span>
        </button>
        <button
          onClick={() => setActiveTab('contributors')}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'contributors'
              ? 'bg-white text-eco-primary shadow-sm'
              : 'text-gray-600 hover:text-eco-primary'
          }`}
        >
          <Users className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-sm md:text-base">Top Contributors</span>
        </button>
      </div>

      {activeTab === 'forum' && renderForum()}
      {showNewPostModal && renderNewPostModal()}
      {selectedPost && renderPostDetails()}
    </div>
  );
};

export default Community;