import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Users, TreePine } from 'lucide-react';
import { CarbonTracker } from './CarbonTracker';

const Dashboard = () => {
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
    <div className="space-y-8">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-eco-primary"
      >
        Welcome Back, Eco Warrior!
      </motion.h2>
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-bold text-eco-primary mb-4">Current Challenges</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-eco-secondary pl-4">
              <h4 className="font-semibold">Zero Waste Week</h4>
              <p className="text-sm text-gray-600">Progress: 75%</p>
              <motion.div
                className="w-full bg-gray-200 rounded-full h-2.5 mt-2"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
              >
                <motion.div
                  className="bg-eco-secondary h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <CarbonTracker />
      </div>
    </div>
  );
};

export default Dashboard;