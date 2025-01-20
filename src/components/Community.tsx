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
  Send,
  Leaf,
  Zap,
  Recycle,
  DollarSign
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ForumPost, ForumComment } from '../types/forum';

const Community = () => {
  const [activeTab, setActiveTab] = useState<'forum' | 'tips' | 'contributors'>('forum');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const mockTips = [
    {
      id: '1',
      title: 'Zero Waste Kitchen Guide',
      author: 'EcoChef',
      points: 250,
      category: 'Waste',
      icon: Recycle,
      likes: 156,
      description: 'Complete guide to reducing kitchen waste, including meal planning, composting, and reusable alternatives.'
    },
    {
      id: '2',
      title: 'Energy-Efficient Home Setup',
      author: 'PowerSaver',
      points: 300,
      category: 'Energy',
      icon: Zap,
      likes: 203,
      description: 'Step-by-step guide to optimize your home's energy usage with smart devices and habits.'
    },
    {
      id: '3',
      title: 'Sustainable Garden Planning',
      author: 'GreenThumb',
      points: 200,
      category: 'Lifestyle',
      icon: Leaf,
      likes: 178,
      description: 'Create your own sustainable garden with native plants and water-saving techniques.'
    }
  ];

  const topContributors = [
    {
      id: '1',
      name: 'EcoWarrior',
      points: 5240,
      contributions: 45,
      badge: 'Earth Guardian',
      avatar: 'https://i.pravatar.cc/150?img=1',
      specialties: ['Energy', 'Waste']
    },
    {
      id: '2',
      name: 'GreenInnovator',
      points: 4890,
      contributions: 38,
      badge: 'Climate Champion',
      avatar: 'https://i.pravatar.cc/150?img=2',
      specialties: ['Transport', 'Lifestyle']
    },
    {
      id: '3',
      name: 'SustainableSage',
      points: 4550,
      contributions: 32,
      badge: 'Eco Expert',
      avatar: 'https://i.pravatar.cc/150?img=3',
      specialties: ['Food', 'Community']
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const renderTipsMarketplace = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-eco-primary">Tips Marketplace</h3>
        <button className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Share Tip</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTips.map((tip) => (
          <motion.div
            key={tip.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-eco-accent rounded-lg">
                  <tip.icon className="h-6 w-6 text-eco-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-eco-primary">{tip.title}</h4>
                  <p className="text-sm text-gray-600">by {tip.author}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{tip.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-eco-secondary" />
                  <span className="text-sm font-medium">{tip.points} points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{tip.likes}</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-eco-background py-3 text-eco-primary font-medium hover:bg-eco-accent/20">
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTopContributors = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-eco-primary">Top Contributors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topContributors.map((contributor, index) => (
          <motion.div
            key={contributor.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <img
                  src={contributor.avatar}
                  alt={contributor.name}
                  className="w-16 h-16 rounded-full"
                />
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 bg-eco-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                    #{index + 1}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-eco-primary">{contributor.name}</h4>
                <p className="text-sm text-gray-600">{contributor.badge}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Points</span>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4 text-eco-secondary" />
                  <span className="font-medium">{contributor.points}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contributions</span>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4 text-eco-secondary" />
                  <span className="font-medium">{contributor.contributions}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {contributor.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-eco-background rounded-full text-xs text-eco-primary"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
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

      {activeTab === 'forum' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <input
                type="text"
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
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-eco-primary">{post.title}</h3>
                      <div className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle like
                      }}
                      className={`flex items-center space-x-1 ${
                        post.isLiked ? 'text-eco-primary' : 'text-gray-400'
                      } hover:text-eco-primary`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                  </div>
                  <p className="mt-2 text-gray-600 line-clamp-2">{post.content}</p>
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
      )}

      {activeTab === 'tips' && renderTipsMarketplace()}
      {activeTab === 'contributors' && renderTopContributors()}
    </div>
  );
};

export default Community;