import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Users, TreePine, Zap, Wind, Trash2, X } from 'lucide-react';
import { CarbonTracker } from './CarbonTracker';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAchievements, setShowAchievements] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [dailyActivity, setDailyActivity] = useState({
    transport: '',
    energy: '',
    waste: ''
  });

  const stats = [
    { icon: Trophy, label: 'Total Points', value: '2,450' },
    { icon: Target, label: 'Active Challenges', value: '3' },
    { icon: Users, label: 'Community Rank', value: '#42' },
    { icon: TreePine, label: 'CO₂ Saved', value: '125kg' },
  ];

  const tips = [
    {
      icon: Wind,
      title: 'Transportation',
      tip: 'Consider carpooling or using public transport to reduce emissions.',
    },
    {
      icon: Zap,
      title: 'Energy Usage',
      tip: 'Switch to LED bulbs and unplug devices when not in use.',
    },
    {
      icon: Trash2,
      title: 'Waste Management',
      tip: 'Start composting organic waste to reduce methane emissions.',
    },
  ];

  const achievements = [
    {
      title: 'Early Adopter',
      description: 'Joined Verdant in its first month',
      date: '2024-01-15',
      icon: '🌱'
    },
    {
      title: 'Challenge Champion',
      description: 'Completed 5 eco-challenges',
      date: '2024-02-01',
      icon: '🏆'
    },
    {
      title: 'Carbon Crusher',
      description: 'Reduced carbon footprint by 50%',
      date: '2024-02-15',
      icon: '🌍'
    },
    {
      title: 'Community Leader',
      description: 'Helped 10 users with their eco-journey',
      date: '2024-03-01',
      icon: '👥'
    }
  ];

  const handleDailyActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log('Daily activity logged:', dailyActivity);
    setActivityModalOpen(false);
    setDailyActivity({ transport: '', energy: '', waste: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-3xl font-bold text-eco-primary">Welcome Back, Eco Warrior!</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-eco-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          onClick={() => setShowAchievements(true)}
        >
          <Trophy className="h-5 w-5" />
          <span>View Achievements</span>
        </motion.button>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <Icon className="h-8 w-8 text-eco-secondary" />
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-eco-primary">{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CarbonTracker />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-eco-primary mb-4">Eco Tips</h3>
            <div className="space-y-4">
              {tips.map((tip) => (
                <motion.div
                  key={tip.title}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-eco-background rounded-lg"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <tip.icon className="h-5 w-5 text-eco-secondary" />
                    <h4 className="font-semibold text-eco-primary">{tip.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{tip.tip}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-xl font-bold text-eco-primary mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setActivityModalOpen(true)}
                className="w-full bg-eco-secondary text-white py-2 rounded-lg hover:bg-eco-primary transition-colors"
              >
                Log Daily Activity
              </button>
              <button
                onClick={() => navigate('/challenges')}
                className="w-full bg-eco-accent text-eco-primary py-2 rounded-lg hover:bg-eco-background transition-colors"
              >
                Join New Challenge
              </button>
              <button
                onClick={() => navigate('/community')}
                className="w-full border-2 border-eco-primary text-eco-primary py-2 rounded-lg hover:bg-eco-primary hover:text-white transition-colors"
              >
                Share Progress
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-eco-primary">Your Achievements</h3>
                <button
                  onClick={() => setShowAchievements(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.title}
                    whileHover={{ scale: 1.02 }}
                    className="bg-eco-background p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-semibold text-eco-primary">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Achieved on {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Activity Modal */}
      <AnimatePresence>
        {activityModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setActivityModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-eco-primary">Log Daily Activity</h3>
                <button
                  onClick={() => setActivityModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleDailyActivitySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transportation (km)
                  </label>
                  <input
                    type="number"
                    value={dailyActivity.transport}
                    onChange={(e) => setDailyActivity(prev => ({ ...prev, transport: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 focus:border-eco-primary focus:ring-eco-primary"
                    placeholder="Enter distance traveled"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Energy Usage (kWh)
                  </label>
                  <input
                    type="number"
                    value={dailyActivity.energy}
                    onChange={(e) => setDailyActivity(prev => ({ ...prev, energy: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 focus:border-eco-primary focus:ring-eco-primary"
                    placeholder="Enter energy consumption"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waste Generated (kg)
                  </label>
                  <input
                    type="number"
                    value={dailyActivity.waste}
                    onChange={(e) => setDailyActivity(prev => ({ ...prev, waste: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 focus:border-eco-primary focus:ring-eco-primary"
                    placeholder="Enter waste generated"
                  />
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setActivityModalOpen(false)}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-eco-primary text-white rounded-lg hover:bg-eco-secondary transition-colors"
                  >
                    Submit
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

export default Dashboard;