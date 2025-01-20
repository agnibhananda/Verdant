import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Users, TreePine, BarChart3, X } from 'lucide-react';
import { CarbonTracker } from './CarbonTracker';
import { AirQualityMonitor } from './AirQualityMonitor';
import { PlotlyChart } from './PlotlyChart';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAchievements, setShowAchievements] = useState(false);

  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first eco-challenge',
      icon: '🌱',
      date: '2024-02-15',
      points: 100,
      unlocked: true
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Complete challenges for 7 days straight',
      icon: '🏆',
      date: '2024-02-22',
      points: 250,
      unlocked: true
    },
    {
      id: '3',
      title: 'Community Leader',
      description: 'Help 10 other members with their challenges',
      icon: '👥',
      date: '2024-03-01',
      points: 500,
      unlocked: true
    },
    {
      id: '4',
      title: 'Carbon Master',
      description: 'Reduce your carbon footprint by 50%',
      icon: '🌍',
      date: null,
      points: 1000,
      unlocked: false
    }
  ];

  const stats = [
    { icon: Trophy, label: 'Total Points', value: '2,450' },
    { icon: Target, label: 'Active Challenges', value: '3' },
    { icon: Users, label: 'Community Rank', value: '#42' },
    { icon: TreePine, label: 'CO₂ Saved', value: '125kg' },
  ];

  const categoryData = [{
    type: 'bar',
    x: ['Transport', 'Energy', 'Waste'],
    y: [30, 25, 15],
    marker: { 
      color: ['#8CB369', '#2D5A27', '#F4E285'],
      opacity: 0.8
    },
    hovertemplate: '%{y} kg CO₂<br>%{x}<extra></extra>'
  }];

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

  const renderAchievementsModal = () => (
    <AnimatePresence>
      {showAchievements && (
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
            className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-eco-primary">Achievements</h2>
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
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg ${
                    achievement.unlocked ? 'bg-eco-background' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h3 className={`font-semibold ${
                        achievement.unlocked ? 'text-eco-primary' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4 text-eco-secondary" />
                      <span className="text-sm font-medium">{achievement.points} points</span>
                    </div>
                    {achievement.unlocked ? (
                      <span className="text-xs text-gray-500">
                        Achieved on {new Date(achievement.date!).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Not yet unlocked</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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
      
      {/* Rest of the dashboard content */}
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
          
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-eco-primary" />
                <h3 className="text-lg font-semibold text-eco-primary">Emissions by Category</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">Distribution of carbon footprint sources</p>
            </div>
            <div className="p-4">
              <PlotlyChart
                data={categoryData}
                title=""
                layout={{
                  height: 300,
                  showlegend: false,
                  xaxis: {
                    showgrid: false,
                    zeroline: false
                  },
                  yaxis: { 
                    title: 'CO₂ (kg)',
                    showgrid: true,
                    gridcolor: 'rgba(0,0,0,0.1)',
                    zeroline: false
                  },
                  bargap: 0.3
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {renderAchievementsModal()}
    </div>
  );
};

export default Dashboard;