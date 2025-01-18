import React from 'react';
import { Trophy, Target, Users, TreePine } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: Trophy, label: 'Total Points', value: '2,450' },
    { icon: Target, label: 'Active Challenges', value: '3' },
    { icon: Users, label: 'Community Rank', value: '#42' },
    { icon: TreePine, label: 'CO₂ Saved', value: '125kg' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-eco-primary">Welcome Back, Eco Warrior!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <Icon className="h-8 w-8 text-eco-secondary" />
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-eco-primary">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-eco-primary mb-4">Current Challenges</h3>
          <div className="space-y-4">
            {/* Placeholder for current challenges */}
            <div className="border-l-4 border-eco-secondary pl-4">
              <h4 className="font-semibold">Zero Waste Week</h4>
              <p className="text-sm text-gray-600">Progress: 75%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-eco-secondary h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-eco-primary mb-4">Community Activity</h3>
          <div className="space-y-4">
            {/* Placeholder for community updates */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-eco-accent flex items-center justify-center">
                <Users className="h-4 w-4 text-eco-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Sarah completed "Plant a Tree" challenge</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;