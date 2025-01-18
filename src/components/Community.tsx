import React, { useState } from 'react';
import { MessageSquare, Users, Trophy, Share2, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Community = () => {
  const [likedTips, setLikedTips] = useState<string[]>([]);
  const [forumPosts, setForumPosts] = useState([
    { id: '1', forum: 'Waste Reduction', topics: 24, posts: 142 },
    { id: '2', forum: 'Energy Conservation', topics: 18, posts: 98 },
    { id: '3', forum: 'Sustainable Living', topics: 32, posts: 215 },
  ]);

  const [tips, setTips] = useState([
    { id: '1', tip: 'DIY Natural Cleaning Solutions', author: 'EcoExpert', likes: 45 },
    { id: '2', tip: 'Smart Home Energy Saving Hacks', author: 'TechGreen', likes: 32 },
    { id: '3', tip: 'Zero-Waste Shopping Guide', author: 'WasteFree', likes: 28 },
  ]);

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
            <h3 className="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Discussion Forums
            </h3>
            <div className="space-y-4">
              {forumPosts.map((forum) => (
                <motion.div
                  key={forum.id}
                  whileHover={{ scale: 1.02 }}
                  className="border-b last:border-0 pb-4 last:pb-0 cursor-pointer"
                >
                  <h4 className="font-semibold text-eco-primary">{forum.forum}</h4>
                  <p className="text-sm text-gray-600">
                    Join the conversation about {forum.forum.toLowerCase()} tips and challenges.
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{forum.topics} topics</span>
                    <span>•</span>
                    <span>{forum.posts} posts</span>
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
              <Share2 className="h-5 w-5 mr-2" />
              Tip Marketplace
            </h3>
            <div className="space-y-4">
              {tips.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-4 border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-eco-primary">{item.tip}</h4>
                    <p className="text-sm text-gray-600">By {item.author}</p>
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
                  <span className="font-bold text-eco-primary w-6">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.points} points</p>
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
              {[
                { name: 'Green Giants', members: 12 },
                { name: 'Eco Warriors', members: 8 },
                { name: 'Planet Protectors', members: 15 },
              ].map((team) => (
                <motion.div
                  key={team.name}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="font-semibold">{team.name}</span>
                  <span className="text-sm text-gray-600">{team.members} members</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Community;