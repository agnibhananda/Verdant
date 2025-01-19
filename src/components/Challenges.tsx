import React, { useState } from 'react';
import { Calendar, Droplet, Zap, Recycle, Camera, Users, MapPin, Phone, CheckCircle, Clock, Award, Upload, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Challenges = () => {
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [verificationData, setVerificationData] = useState<Record<string, { 
    status: string; 
    photo: string | null;
    reviews: Array<{ userId: string; score: number }>;
    reviewsDone: number;
  }>>({});

  const challenges = [
    {
      id: '1',
      icon: Droplet,
      title: 'Water Conservation Week',
      description: 'Reduce your daily water consumption by implementing smart water-saving techniques.',
      category: 'sustainable',
      points: 500,
      difficulty: 'Medium',
      participants: 1234,
      verificationMethod: 'photo',
      requirements: [
        'Track daily water usage',
        'Submit photo evidence of water-saving techniques',
        'Share tips with community'
      ],
      milestones: [
        { title: 'Start Challenge', points: 50, completed: false },
        { title: 'First Week Complete', points: 150, completed: false },
        { title: 'Share Progress', points: 100, completed: false },
        { title: 'Challenge Complete', points: 200, completed: false }
      ],
      tips: [
        'Install water-efficient fixtures',
        'Fix leaky faucets',
        'Collect rainwater for plants'
      ]
    },
    {
      id: '2',
      icon: Zap,
      title: 'Energy-Free Evening',
      description: 'Spend one evening per week without using electricity (except essentials).',
      category: 'energy',
      points: 300,
      difficulty: 'Easy',
      participants: 2156,
      verificationMethod: 'photo',
      requirements: [
        'Document electricity-free activities',
        'Submit photo evidence of candlelit evening',
        'Share experience in community forum'
      ],
      milestones: [
        { title: 'Start Challenge', points: 30, completed: false },
        { title: 'First Evening Complete', points: 100, completed: false },
        { title: 'Community Verification', points: 70, completed: false },
        { title: 'Challenge Complete', points: 100, completed: false }
      ],
      tips: [
        'Plan activities in advance',
        'Use natural light',
        'Try meditation or reading'
      ]
    },
    {
      id: '3',
      icon: Recycle,
      title: 'Zero Waste Challenge',
      description: 'Produce zero non-recyclable waste for an entire week.',
      category: 'waste',
      points: 750,
      difficulty: 'Hard',
      participants: 892,
      verificationMethod: 'photo',
      requirements: [
        'Track all waste produced',
        'Submit daily photo evidence',
        'Document waste reduction methods'
      ],
      milestones: [
        { title: 'Start Challenge', points: 75, completed: false },
        { title: 'First Day Zero Waste', points: 200, completed: false },
        { title: 'Week Complete', points: 175, completed: false },
        { title: 'Challenge Complete', points: 300, completed: false }
      ],
      tips: [
        'Use reusable containers',
        'Shop at bulk stores',
        'Start composting'
      ]
    }
  ];

  const handleJoinChallenge = (challengeId: string) => {
    setJoinedChallenges(prev => {
      if (prev.includes(challengeId)) {
        return prev.filter(id => id !== challengeId);
      }
      return [...prev, challengeId];
    });
    setSelectedChallenge(null);
  };

  const handlePhotoUpload = async (challengeId: string, photo: File) => {
    // In a real app, you would upload the photo to storage
    const photoUrl = URL.createObjectURL(photo);
    setVerificationData(prev => ({
      ...prev,
      [challengeId]: {
        status: 'pending_reviews',
        photo: photoUrl,
        reviews: [],
        reviewsDone: 0
      }
    }));
  };

  const handlePeerReview = (challengeId: string, score: number) => {
    setVerificationData(prev => {
      const challenge = prev[challengeId];
      if (!challenge) return prev;

      const newReviews = [...challenge.reviews, { userId: 'current-user', score }];
      const totalScore = newReviews.reduce((sum, review) => sum + review.score, 0);
      const averageScore = totalScore / newReviews.length;
      
      const newStatus = newReviews.length >= 3 
        ? (averageScore >= 60 ? 'verified' : 'rejected')
        : 'pending_reviews';

      return {
        ...prev,
        [challengeId]: {
          ...challenge,
          reviews: newReviews,
          status: newStatus
        }
      };
    });

    // Add points for completing a review
    if (verificationData[challengeId]?.reviewsDone === 2) {
      // User completed 3 reviews, award 10 points
      console.log('Awarded 10 points for completing 3 reviews');
    }
  };

  const renderVerificationSection = (challenge: any) => {
    const verification = verificationData[challenge.id];
    
    if (!verification) {
      return (
        <div className="mt-4">
          <label className="flex flex-col items-center p-4 border-2 border-dashed border-eco-primary rounded-lg cursor-pointer hover:bg-eco-accent/10">
            <Camera className="h-8 w-8 text-eco-primary mb-2" />
            <span className="text-sm text-gray-600">Upload verification photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(challenge.id, file);
              }}
            />
          </label>
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-4">
        {verification.photo && (
          <div className="relative">
            <img
              src={verification.photo}
              alt="Verification"
              className="w-full rounded-lg"
            />
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm">
              {verification.status === 'pending_reviews' && (
                <span className="text-yellow-500">Pending Reviews</span>
              )}
              {verification.status === 'verified' && (
                <span className="text-green-500">Verified</span>
              )}
              {verification.status === 'rejected' && (
                <span className="text-red-500">Rejected</span>
              )}
            </div>
          </div>
        )}

        {verification.status === 'pending_reviews' && verification.reviews.length < 3 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Rate this submission (0-100):</p>
            <div className="flex space-x-2">
              {[30, 60, 90].map((score) => (
                <button
                  key={score}
                  onClick={() => handlePeerReview(challenge.id, score)}
                  className="flex-1 py-2 px-4 bg-eco-background rounded-lg hover:bg-eco-accent/20"
                >
                  <Star className="h-4 w-4 mx-auto mb-1" />
                  {score}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          {verification.reviews.length} of 3 reviews completed
          {verification.status === 'verified' && ' • +30 points awarded'}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-eco-primary">Active Challenges</h2>
          <p className="mt-2 text-gray-600">Join challenges to earn points and make a difference</p>
        </div>
        <div className="flex items-center space-x-2 text-eco-primary">
          <Calendar className="h-5 w-5" />
          <span>March 2024</span>
        </div>
      </div>

      {joinedChallenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-bold text-eco-primary mb-4">Your Active Challenges</h3>
          <div className="space-y-6">
            {challenges
              .filter(challenge => joinedChallenges.includes(challenge.id))
              .map(challenge => (
                <div key={`active-${challenge.id}`} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-eco-accent rounded-lg">
                        <challenge.icon className="h-6 w-6 text-eco-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-eco-primary">{challenge.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>7 days remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {renderVerificationSection(challenge)}

                  <div className="mt-4 space-y-4">
                    <div className="bg-eco-background rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-eco-primary h-full rounded-full transition-all duration-500"
                        style={{ width: '45%' }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {challenge.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-eco-background"
                        >
                          <div className={`p-1 rounded-full ${
                            milestone.completed ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {milestone.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-eco-primary">{milestone.title}</p>
                            <p className="text-sm text-gray-600">+{milestone.points} points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const isJoined = joinedChallenges.includes(challenge.id);

          return (
            <motion.div
              key={challenge.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-eco-accent rounded-lg">
                    <challenge.icon className="h-6 w-6 text-eco-primary" />
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
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-eco-secondary" />
                      <span className="font-semibold">{challenge.points}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className={`font-semibold ${
                      challenge.difficulty === 'Easy' ? 'text-green-500' :
                      challenge.difficulty === 'Medium' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>{challenge.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-eco-secondary" />
                      <span className="font-semibold">{challenge.participants}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleJoinChallenge(challenge.id)}
                className={`w-full py-3 font-semibold transition-colors ${
                  isJoined
                    ? 'bg-eco-secondary text-white hover:bg-eco-primary'
                    : 'bg-eco-primary text-white hover:bg-eco-secondary'
                }`}
              >
                {isJoined ? 'Leave Challenge' : 'Join Challenge'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;