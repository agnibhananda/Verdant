import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Users, TreePine, Zap, Wind, Trash2, X } from 'lucide-react';
import { CarbonTracker } from './CarbonTracker';
import { AirQualityMonitor } from './AirQualityMonitor';
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
    <div className="space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-eco-primary">Welcome Back, Eco Warrior!</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-eco-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 w-full md:w-auto justify-center"
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-4 md:p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <Icon className="h-6 md:h-8 w-6 md:w-8 text-eco-secondary" />
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-xl md:text-2xl font-bold text-eco-primary">{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <CarbonTracker />
        </div>
        <div className="space-y-4 md:space-y-6">
          <AirQualityMonitor />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;