import React from 'react';
import { MessageSquare, Users, Trophy, Share2 } from 'lucide-react';

const Community = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-eco-primary">Community Hub</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Discussion Forums
            </h3>
            <div className="space-y-4">
              {['Waste Reduction', 'Energy Conservation', 'Sustainable Living'].map((forum) => (
                <div key={forum} className="border-b last:border-0 pb-4 last:pb-0">
                  <h4 className="font-semibold text-eco-primary">{forum}</h4>
                  <p className="text-sm text-gray-600">Join the conversation about {forum.toLowerCase()} tips and challenges.</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>24 topics</span>
                    <span>•</span>
                    <span>142 posts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-eco-primary mb-4 flex items-center">
              <Share2 className="h-5 w-5 mr-2" />
              Tip Marketplace
            </h3>
            <div className="space-y-4">
              {[
                { tip: 'DIY Natural Cleaning Solutions', author: 'EcoExpert', likes: 45 },
                { tip: 'Smart Home Energy Saving Hacks', author: 'TechGreen', likes: 32 },
                { tip: 'Zero-Waste Shopping Guide', author: 'WasteFree', likes: 28 },
              ].map((item) => (
                <div key={item.tip} className="flex items-start space-x-4 border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex-1">
                    <h4 className="font-semibold text-eco-primary">{item.tip}</h4>
                    <p className="text-sm text-gray-600">By {item.author}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-eco-secondary">
                    <Trophy className="h-4 w-4" />
                    <span>{item.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
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
                <div key={user.name} className="flex items-center space-x-4">
                  <span className="font-bold text-eco-primary w-6">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
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
                <div key={team.name} className="flex items-center justify-between">
                  <span className="font-semibold">{team.name}</span>
                  <span className="text-sm text-gray-600">{team.members} members</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;