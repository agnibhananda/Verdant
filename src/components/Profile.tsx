import React, { useState, useRef } from 'react';
import { Medal, Award, Calendar, Camera, Edit2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("./public/avatar.jpg");
  
  const [userProfile, setUserProfile] = useState({
    name: 'Agnibha Nanda',
    badge: 'Earth Guardian',
    points: 420,
    joinDate: 'January 2025',
    completedChallenges: 12,
    currentStreak: 15,
    bio: 'Passionate about environmental conservation and sustainable living.',
    email: 'agnibhananda@gmail.com'
  });

  const [editableProfile, setEditableProfile] = useState({ ...userProfile });

  const [achievements, setAchievements] = useState([
    { 
      id: '1',
      title: 'First Challenge',
      description: 'Complete your first eco-challenge',
      date: '2024-01-15',
      icon: '🌱',
      unlocked: true
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Complete challenges for 7 days straight',
      date: '2024-02-01',
      icon: '🏆',
      unlocked: true
    },
    {
      id: '3',
      title: 'Community Leader',
      description: 'Help 10 other members with their challenges',
      date: '2024-02-15',
      icon: '👥',
      unlocked: true
    },
    {
      id: '4',
      title: 'Carbon Master',
      description: 'Reduce your carbon footprint by 75%',
      date: null,
      icon: '🌍',
      unlocked: false
    }
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = () => {
    if (editMode) {
      setUserProfile(editableProfile);
    }
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setEditableProfile({ ...userProfile });
    setEditMode(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-eco-primary p-2 rounded-full text-white hover:bg-eco-secondary transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              {editMode ? (
                <input
                  type="text"
                  value={editableProfile.name}
                  onChange={(e) => setEditableProfile({ ...editableProfile, name: e.target.value })}
                  className="text-3xl font-bold text-eco-primary bg-eco-background rounded px-2 py-1 mb-2"
                />
              ) : (
                <h2 className="text-3xl font-bold text-eco-primary">{userProfile.name}</h2>
              )}
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-eco-secondary" />
                <span className="text-eco-secondary font-semibold">{userProfile.badge}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <button
                  onClick={handleEditSave}
                  className="p-2 text-eco-primary hover:text-eco-secondary transition-colors"
                >
                  <Save className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleEditSave}
                className="p-2 text-eco-primary hover:text-eco-secondary transition-colors"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {editMode ? (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editableProfile.email}
                onChange={(e) => setEditableProfile({ ...editableProfile, email: e.target.value })}
                className="w-full bg-eco-background rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={editableProfile.bio}
                onChange={(e) => setEditableProfile({ ...editableProfile, bio: e.target.value })}
                className="w-full bg-eco-background rounded px-3 py-2 h-24"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-gray-600">{userProfile.bio}</p>
            <p className="text-sm text-gray-500 mt-2">{userProfile.email}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <Medal className="h-5 w-5 text-eco-primary" />
              <span className="text-sm text-gray-600">Total Points</span>
            </div>
            <p className="text-2xl font-bold text-eco-primary mt-2">{userProfile.points}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-eco-primary" />
              <span className="text-sm text-gray-600">Completed Challenges</span>
            </div>
            <p className="text-2xl font-bold text-eco-primary mt-2">{userProfile.completedChallenges}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-eco-primary" />
              <span className="text-sm text-gray-600">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-eco-primary mt-2">{userProfile.currentStreak} days</p>
          </motion.div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-xl font-bold text-eco-primary mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg ${
                achievement.unlocked ? 'bg-eco-background' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h4 className={`font-semibold ${
                    achievement.unlocked ? 'text-eco-primary' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              {achievement.unlocked ? (
                <p className="text-xs text-gray-500 mt-2">
                  Achieved on {new Date(achievement.date!).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-2">Not yet unlocked</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;