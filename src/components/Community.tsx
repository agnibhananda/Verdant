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
      description: 'Step-by-step guide to optimize your home energy usage with smart devices and habits.'
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-eco-primary">Community</h2>
        <button
          onClick={() => setShowNewPostModal(true)}
          className="bg-eco-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Post</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex space-x-4 p-4">
            {(['forum', 'tips', 'contributors'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-eco-primary text-white'
                    : 'text-gray-600 hover:bg-eco-background'
                }`}
              >
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'tips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <motion.div
                    key={tip.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-eco-background p-4 rounded-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Icon className="h-6 w-6 text-eco-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-eco-primary">{tip.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-eco-secondary" />
                        <span className="text-sm font-medium">{tip.points} points</span>
                      </div>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-eco-primary">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{tip.likes}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === 'forum' && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-primary focus:border-eco-primary"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-eco-background">
                  <Filter className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-primary mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading discussions...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-600">{error}</div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    No discussions yet. Be the first to start one!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Forum posts would be rendered here */}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contributors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Contributors would be rendered here */}
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-eco-primary">Create New Post</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-primary focus:border-eco-primary"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eco-primary focus:border-eco-primary h-32"
                    placeholder="Share your thoughts..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-eco-primary text-white rounded-lg hover:bg-eco-secondary"
                  >
                    Post
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;