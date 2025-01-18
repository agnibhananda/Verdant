import React, { useState } from 'react';
import { MessageSquare, Users, Trophy, Share2, ThumbsUp, Plus, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Community = () => {
  const [likedTips, setLikedTips] = useState<string[]>([]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showNewTipModal, setShowNewTipModal] = useState(false);
  const [selectedForum, setSelectedForum] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newTip, setNewTip] = useState({ tip: '', category: '' });
  const [joinedTeams, setJoinedTeams] = useState<string[]>([]);

  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-eco-primary">Community Hub</h2>

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
            {/* Rest of the forums content */}
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
            {/* Rest of the tips content */}
          </motion.div>
        </div>

        {/* Sidebar content */}
        <div className="space-y-4 md:space-y-6">
          {/* Leaderboard and Teams sections */}
        </div>
      </div>

      {/* Modals remain unchanged as they are already responsive */}
    </div>
  );
};

export default Community;