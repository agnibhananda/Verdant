import React, { useState, useRef } from 'react';
import { Medal, Award, Calendar, Camera, Edit2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("https://i.pinimg.com/1200x/aa/20/61/aa2061e33d62e60f2cfcded5d638c78b.jpg");
  
  const [userProfile, setUserProfile] = useState({
    name: 'Agnibha Nanda',
    badge: 'Earth Guardian',
    points: 420,
    joinDate: 'January 2025',
    completedChallenges: 12,
    currentStreak: 15,
    bio: 'i like to build cool stuff',
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
    <div className="space-y-6 md:space-y-8 p-4 md:p-0">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
          <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-4 md:mb-0">
            <div className="relative mb-4 md:mb-0">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={profileImage}
                alt="Profile"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-eco-primary p-1.5 md:p-2 rounded-full text-white hover:bg-eco-secondary transition-colors"
              >
                <Camera className="h-3 w-3 md:h-4 md:w-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center md:text-left">
              {editMode ? (
                <input
                  type="text"
                  value={editableProfile.name}
                  onChange={(e) => setEditableProfile({ ...editableProfile, name: e.target.value })}
                  className="text-xl md:text-3xl font-bold text-eco-primary bg-eco-background rounded px-2 py-1 mb-2"
                />
              ) : (
                <h2 className="text-xl md:text-3xl font-bold text-eco-primary">{userProfile.name}</h2>
              )}
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Award className="h-4 w-4 md:h-5 md:w-5 text-eco-secondary" />
                <span className="text-eco-secondary font-semibold text-sm md:text-base">{userProfile.badge}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end space-x-2">
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <button
                  onClick={handleEditSave}
                  className="p-2 text-eco-primary hover:text-eco-secondary transition-colors"
                >
                  <Save className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleEditSave}
                className="p-2 text-eco-primary hover:text-eco-secondary transition-colors"
              >
                <Edit2 className="h-4 w-4 md:h-5 md:w-5" />
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
                className="w-full bg-eco-background rounded px-3 py-2 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={editableProfile.bio}
                onChange={(e) => setEditableProfile({ ...editableProfile, bio: e.target.value })}
                className="w-full bg-eco-background rounded px-3 py-2 h-20 md:h-24 text-sm md:text-base"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-sm md:text-base text-gray-600">{userProfile.bio}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">{userProfile.email}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background rounded-lg p-3 md:p-4"
          >
            <div className="flex items-center space-x-2">
              <Medal className="h-4 w-4 md:h-5 md:w-5 text-eco-primary" />
              <span className="text-xs md:text-sm text-gray-600">Total Points</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-eco-primary mt-2">{userProfile.points}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background rounded-lg p-3 md:p-4"
          >
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 md:h-5 md:w-5 text-eco-primary" />
              <span className="text-xs md:text-sm text-gray-600">Completed Challenges</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-eco-primary mt-2">{userProfile.completedChallenges}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-eco-background rounded-lg p-3 md:p-4"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 md:h-5 md:w-5 text-eco-primary" />
              <span className="text-xs md:text-sm text-gray-600">Current Streak</span>
            </div>
            <p className="text-lg md:text-2xl font-bold text-eco-primary mt-2">{userProfile.currentStreak} days</p>
          </motion.div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
        <h3 className="text-lg md:text-xl font-bold text-eco-primary mb-4 md:mb-6">Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`p-3 md:p-4 rounded-lg ${
                achievement.unlocked ? 'bg-eco-background' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl md:text-2xl">{achievement.icon}</span>
                <div>
                  <h4 className={`font-semibold text-sm md:text-base ${
                    achievement.unlocked ? 'text-eco-primary' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600">{achievement.description}</p>
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