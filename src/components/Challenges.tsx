import React from 'react';
import { Calendar, Droplet, Zap, Recycle } from 'lucide-react';

const Challenges = () => {
  const challenges = [
    {
      icon: Droplet,
      title: 'Water Conservation Week',
      description: 'Reduce your daily water consumption by implementing smart water-saving techniques.',
      category: 'sustainable',
      points: 500,
      difficulty: 'Medium',
      participants: 1234,
    },
    {
      icon: Zap,
      title: 'Energy-Free Evening',
      description: 'Spend one evening per week without using electricity (except essentials).',
      category: 'energy',
      points: 300,
      difficulty: 'Easy',
      participants: 2156,
    },
    {
      icon: Recycle,
      title: 'Zero Waste Challenge',
      description: 'Produce zero non-recyclable waste for an entire week. Sustainable Living Transformation ',
      category: 'waste',
      points: 750,
      difficulty: 'Hard',
      participants: 892,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-eco-primary">Monthly Challenges</h2>
        <div className="flex items-center space-x-2 text-eco-primary">
          <Calendar className="h-5 w-5" />
          <span>March 2024</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
          return (
            <div key={challenge.title} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-eco-accent rounded-lg">
                    <Icon className="h-6 w-6 text-eco-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-eco-primary">{challenge.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold capitalize">{challenge.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Points:</span>
                    <span className="font-semibold">{challenge.points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-semibold">{challenge.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-semibold">{challenge.participants.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-eco-primary text-white font-semibold hover:bg-eco-secondary transition-colors" style: "margin-top:auto">
                Join Challenge
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;