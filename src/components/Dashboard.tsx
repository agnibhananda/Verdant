import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Users, TreePine, Zap, Wind, Trash2 } from 'lucide-react';
import { CarbonTracker } from './CarbonTracker';

const Dashboard = () => {
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
              <button className="w-full bg-eco-secondary text-white py-2 rounded-lg hover:bg-eco-primary transition-colors">
                Log Daily Activity
              </button>
              <button className="w-full bg-eco-accent text-eco-primary py-2 rounded-lg hover:bg-eco-background transition-colors">
                Join New Challenge
              </button>
              <button className="w-full border-2 border-eco-primary text-eco-primary py-2 rounded-lg hover:bg-eco-primary hover:text-white transition-colors">
                Share Progress
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;