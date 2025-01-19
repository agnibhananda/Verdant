import React, { useState } from 'react';
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
  BookOpen
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
  isLiked: boolean;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  likes: number;
  price: number;
  preview: string;
}

interface Contributor {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
  contributions: number;
  specialties: string[];
  badges: string[];
}

const Community = () => {
  const [activeTab, setActiveTab] = useState<'forum' | 'tips' | 'contributors'>('forum');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const posts: Post[] = [
    {
      id: '1',
      title: 'How to start a home garden?',
      content: 'I want to grow my own vegetables but don\'t know where to start...',
      author: {
        name: 'Green Thumb',
        avatar: '/avatar.jpg',
        reputation: 1250
      },
      likes: 45,
      comments: 12,
      tags: ['gardening', 'beginner', 'sustainable-living'],
      createdAt: '2024-03-08T10:00:00Z',
      isLiked: false
    },
    {
      id: '2',
      title: 'Solar Panel Installation Guide',
      content: 'Comprehensive guide on installing solar panels...',
      author: {
        name: 'SolarPro',
        avatar: '/avatar.jpg',
        reputation: 3420
      },
      likes: 89,
      comments: 34,
      tags: ['solar', 'energy', 'diy'],
      createdAt: '2024-03-07T15:30:00Z',
      isLiked: true
    }
  ];

  const tips: Tip[] = [
    {
      id: '1',
      title: 'Zero Waste Kitchen Guide',
      description: 'Transform your kitchen into a zero-waste zone with these practical tips.',
      author: {
        name: 'EcoChef',
        avatar: '/avatar.jpg',
        reputation: 2150
      },
      category: 'Kitchen',
      difficulty: 'Beginner',
      likes: 156,
      price: 5,
      preview: 'Learn how to reduce kitchen waste by 90% with simple changes...'
    },
    {
      id: '2',
      title: 'Advanced Composting Techniques',
      description: 'Master the art of composting with advanced methods and tips.',
      author: {
        name: 'CompostKing',
        avatar: '/avatar.jpg',
        reputation: 4200
      },
      category: 'Gardening',
      difficulty: 'Advanced',
      likes: 234,
      price: 10,
      preview: 'Discover how to create perfect compost in half the time...'
    }
  ];

  const contributors: Contributor[] = [
    {
      id: '1',
      name: 'EcoWarrior',
      avatar: '/avatar.jpg',
      reputation: 5420,
      contributions: 156,
      specialties: ['Solar Energy', 'Zero Waste'],
      badges: ['Top Contributor', 'Expert']
    },
    {
      id: '2',
      name: 'GreenGuru',
      avatar: '/avatar.jpg',
      reputation: 4850,
      contributions: 132,
      specialties: ['Sustainable Living', 'Urban Farming'],
      badges: ['Community Leader', 'Mentor']
    }
  ];

  const renderForum = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary"
          />
        </div>
        <button
          onClick={() => {}}
          className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Discussion</span>
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-eco-primary">{post.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{post.author.name}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-eco-primary">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-gray-600">{post.content}</p>
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
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <button
                className={`flex items-center space-x-1 ${
                  post.isLiked ? 'text-eco-primary' : 'text-gray-400'
                } hover:text-eco-primary`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-400 hover:text-eco-primary">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTips = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tips..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary"
          />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-primary">
          <option value="all">All Categories</option>
          <option value="kitchen">Kitchen</option>
          <option value="gardening">Gardening</option>
          <option value="energy">Energy</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip) => (
          <motion.div
            key={tip.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tip.difficulty === 'Beginner' ? 'bg-green-100 text-green-600' :
                  tip.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {tip.difficulty}
                </span>
                <span className="text-eco-primary font-bold">${tip.price}</span>
              </div>
              <h3 className="text-lg font-semibold text-eco-primary mb-2">{tip.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{tip.preview}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={tip.author.avatar}
                    alt={tip.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{tip.author.name}</p>
                    <p className="text-gray-500">{tip.reputation} rep</p>
                  </div>
                </div>
                <button className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary">
                  View Tip
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContributors = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contributors.map((contributor) => (
          <motion.div
            key={contributor.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center space-x-4">
              <img
                src={contributor.avatar}
                alt={contributor.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-eco-primary">{contributor.name}</h3>
                <p className="text-sm text-gray-500">{contributor.reputation} reputation</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Trophy className="h-4 w-4 text-eco-secondary" />
                <span>{contributor.contributions} contributions</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {contributor.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-eco-background rounded-full text-xs text-eco-primary"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {contributor.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2 py-1 bg-eco-accent/20 rounded-full text-xs text-eco-primary font-medium"
                  >
                    {badge}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-eco-primary">Community</h1>
        <p className="mt-2 text-gray-600">Connect, share, and learn with fellow eco-warriors</p>
      </div>

      <div className="flex space-x-1 bg-eco-background p-1 rounded-lg mb-8">
        <button
          onClick={() => setActiveTab('forum')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'forum'
              ? 'bg-white text-eco-primary shadow-sm'
              : 'text-gray-600 hover:text-eco-primary'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Forum</span>
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'tips'
              ? 'bg-white text-eco-primary shadow-sm'
              : 'text-gray-600 hover:text-eco-primary'
          }`}
        >
          <Lightbulb className="h-5 w-5" />
          <span>Tips Marketplace</span>
        </button>
        <button
          onClick={() => setActiveTab('contributors')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'contributors'
              ? 'bg-white text-eco-primary shadow-sm'
              : 'text-gray-600 hover:text-eco-primary'
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Top Contributors</span>
        </button>
      </div>

      {activeTab === 'forum' && renderForum()}
      {activeTab === 'tips' && renderTips()}
      {activeTab === 'contributors' && renderContributors()}
    </div>
  );
};

export default Community;