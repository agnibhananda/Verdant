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

  // Rest of the component code remains the same...
  
  return (
    // Component JSX remains the same...
  );
};

export default Community;