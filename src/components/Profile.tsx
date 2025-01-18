import React from 'react';
import { Medal, Award, Calendar, Camera } from 'lucide-react';

const Profile = () => {
  const userProfile = {
    name: 'Jane Green',
    badge: 'Earth Guardian',
    points: 2450,
    joinDate: 'January 2024',
    completedChallenges: 12,
    currentStreak: 15,
  };

  const achievements = [
    { title: 'First Challenge', description: 'Complete your first eco-challenge', date: '2024-01-15' },
    { title: 'Week Warrior', description: 'Complete challenges for 7 days straight', date: '2024-02-01' },
    { title: 'Community Leader', description: 'Help 10 other members with their challenges', date: '2024-02-15' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-eco-primary p-2 rounded-full text-white">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-eco-primary">{userProfile.name}</h2>
            <div className="flex items-center space-x-2 mt-2">
              <Award className="h-5 w-5 text-eco-secondary" />
              <span className="text-eco-secondary font-semibold">{userProfile.badge}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-eco-background rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Medal className="h-5 w-5 text-eco-primary" />
              <span className="text-sm text-gray-600">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-eco-primary mt-2">{userProfile.points}</p>
          </div>
          <div className="bg-eco-background rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-eco-primary" />
              <span className="text-sm text-gray-600">Completed Challenges</span>
            </div>
            <p className="text-2xl font-bold text-eco-primary mt-2">{userProfile.completedChallenges}</p>
          </div>
          <div className="bg-eco-background rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-eco-primary" />
              <span className="text-sm text-gray-600">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-eco-primary mt-2">{userProfile.currentStreak} days</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-bold text-eco-primary mb-6">Achievements</h3>
        <div className="space-y-6">
          {achievements.map((achievement) => (
            <div key={achievement.title} className="flex items-start space-x-4">
              <div className="bg-eco-accent p-2 rounded-lg">
                <Medal className="h-6 w-6 text-eco-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-eco-primary">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">Achieved on {new Date(achievement.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;