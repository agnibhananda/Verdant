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

  const [forumPosts, setForumPosts] = useState([
    { 
      id: '1', 
      forum: 'Waste Reduction', 
      topics: [
        {
          id: '1',
          title: 'Best composting practices',
          author: 'GreenThumb',
          content: 'Share your composting tips and tricks here!',
          comments: [
            { id: '1', author: 'EcoWarrior', content: 'I use a tumbler composter, works great!' },
          ],
          date: new Date().toISOString()
        }
      ]
    },
    { 
      id: '2', 
      forum: 'Energy Conservation',
      topics: [
        {
          id: '1',
          title: 'Solar panel installation tips',
          author: 'SolarPro',
          content: 'Looking for advice on home solar installation.',
          comments: [],
          date: new Date().toISOString()
        }
      ]
    },
    { 
      id: '3', 
      forum: 'Sustainable Living',
      topics: [
        {
          id: '1',
          title: 'Zero waste shopping guide',
          author: 'WasteFree',
          content: 'Here are my favorite zero waste stores.',
          comments: [],
          date: new Date().toISOString()
        }
      ]
    },
  ]);

  const [tips, setTips] = useState([
    { id: '1', tip: 'DIY Natural Cleaning Solutions', author: 'EcoExpert', likes: 45, category: 'Home' },
    { id: '2', tip: 'Smart Home Energy Saving Hacks', author: 'TechGreen', likes: 32, category: 'Energy' },
    { id: '3', tip: 'Zero-Waste Shopping Guide', author: 'WasteFree', likes: 28, category: 'Lifestyle' },
  ]);

  const teams = [
    { id: '1', name: 'Green Giants', members: 12, description: 'Focus on reducing carbon footprint' },
    { id: '2', name: 'Eco Warriors', members: 8, description: 'Zero waste lifestyle advocates' },
    { id: '3', name: 'Planet Protectors', members: 15, description: 'Conservation and sustainability' },
  ];

  const handleLikeTip = (tipId: string) => {
    setLikedTips(prev => {
      if (prev.includes(tipId)) {
        return prev.filter(id => id !== tipId);
      }
      return [...prev, tipId];
    });

    setTips(prev =>
      prev.map(tip =>
        tip.id === tipId
          ? { ...tip, likes: tip.likes + (likedTips.includes(tipId) ? -1 : 1) }
          : tip
      )
    );
  };

  const handleNewPost = () => {
    if (!selectedForum || !newPost.title || !newPost.content) return;

    setForumPosts(prev => 
      prev.map(forum => {
        if (forum.id === selectedForum) {
          return {
            ...forum,
            topics: [
              ...forum.topics,
              {
                id: Date.now().toString(),
                title: newPost.title,
                author: 'You',
                content: newPost.content,
                comments: [],
                date: new Date().toISOString()
              }
            ]
          };
        }
        return forum;
      })
    );

    setNewPost({ title: '', content: '' });
    setShowNewPostModal(false);
  };

  const handleNewTip = () => {
    if (!newTip.tip || !newTip.category) return;

    setTips(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        tip: newTip.tip,
        author: 'You',
        likes: 0,
        category: newTip.category
      }
    ]);

    setNewTip({ tip: '', category: '' });
    setShowNewTipModal(false);
  };

  const handleJoinTeam = (teamId: string) => {
    setJoinedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      }
      return [...prev, teamId];
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-eco-primary">Community Hub</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-eco-primary flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Discussion Forums
              </h3>
              <button
                onClick={() => setShowNewPostModal(true)}
                className="bg-eco-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-eco-secondary transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </button>
            </div>
            <div className="space-y-4">
              {forumPosts.map((forum) => (
                <motion.div
                  key={forum.id}
                  whileHover={{ scale: 1.02 }}
                  className="border-b last:border-0 pb-4 last:pb-0"
                >
                  <h4 className="font-semibold text-eco-primary">{forum.forum}</h4>
                  <div className="mt-2 space-y-2">
                    {forum.topics.map(topic => (
                      <div key={topic.id} className="bg-eco-background p-3 rounded-lg">
                        <h5 className="font-medium">{topic.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{topic.content}</p>
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                          <span>{topic.author}</span>
                          <span>{new Date(topic.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-eco-primary flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Tip Marketplace
              </h3>
              <button
                onClick={() => setShowNewTipModal(true)}
                className="bg-eco-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-eco-secondary transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Share Tip</span>
              </button>
            </div>
            <div className="space-y-4">
              {tips.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-4 border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-eco-primary">{item.tip}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>By {item.author}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLikeTip(item.id)}
                    className="flex items-center space-x-2 text-eco-secondary"
                  >
                    {likedTips.includes(item.id) ? (
                      <ThumbsUp className="h-4 w-4 fill-current" />
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                    <span>{item.likes}</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Leaderboard
            </h3>
            <div className="space-y-4">
              {[
                { name: 'GreenWarrior', points: 12450 },
                { name: 'EcoHero', points: 11200 },
                { name: 'PlanetSaver', points: 10800 },
              ].map((user, index) => (
                <motion.div
                  key={user.name}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4"
                >
                  <span className={`font-bold ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-500' :
                    index === 2 ? 'text-amber-700' :
                    'text-eco-primary'
                  } w-6`}>{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.points.toLocaleString()} points</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Active Teams
            </h3>
            <div className="space-y-4">
              {teams.map((team) => (
                <motion.div
                  key={team.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-eco-background rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{team.name}</h4>
                      <p className="text-sm text-gray-600">{team.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{team.members} members</p>
                    </div>
                    <button
                      onClick={() => handleJoinTeam(team.id)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        joinedTeams.includes(team.id)
                          ? 'bg-eco-secondary text-white'
                          : 'bg-eco-accent text-eco-primary'
                      }`}
                    >
                      {joinedTeams.includes(team.id) ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
            onClick={() => setShowNewPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-eco-primary">Create New Post</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Forum
                  </label>
                  <select
                    value={selectedForum || ''}
                    onChange={(e) => setSelectedForum(e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-eco-primary focus:ring-eco-primary"
                  >
                    <option value="">Choose a forum</option>
                    {forumPosts.map(forum => (
                      <option key={forum.id} value={forum.id}>{forum.forum}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 focus:border-eco-primary focus:ring-eco-primary"
                    placeholder="Enter post title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 focus:border-eco-primary focus:ring-eco-primary h-32"
                    placeholder="Write your post content"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowNewPostModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNewPost}
                    className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary transition-colors flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Tip Modal */}
      <AnimatePresence>
        {showNewTipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewTipModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-eco-primary">Share a Tip</h3>
                <button
                  onClick={() => setShowNewTipModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newTip.category}
                    onChange={(e) => setNewTip(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 focus:border-eco-primary focus:ring-eco-primary"
                  >
                    <option value="">Select category</option>
                    <option value="Home">Home</option>
                    <option value="Energy">Energy</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Transport">Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip
                  </label>
                  <textarea
                    value={newTip.tip}
                    onChange={(e) => setNewTip(prev => ({ ...prev, tip: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 focus:border-eco-primary focus:ring-eco-primary h-32"
                    placeholder="Share your eco-friendly tip"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowNewTipModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNewTip}
                    className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary transition-colors flex items-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
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