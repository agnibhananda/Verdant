import React, { useState } from 'react';
import { Calendar, Droplet, Zap, Recycle, Camera, Users, MapPin, Phone, CheckCircle, Clock, Award, Upload, Star, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Challenges = () => {
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
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
      ],
      instructions: [
        'Take a photo of your water meter at the start',
        'Document water-saving methods daily',
        'Share your progress in the community forum',
        'Submit final water meter reading'
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
      ],
      instructions: [
        'Choose one evening per week',
        'Turn off all non-essential electronics',
        'Document your activities with photos',
        'Share your experience with the community'
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
      ],
      instructions: [
        'Collect and categorize your waste',
        'Take daily photos of waste reduction efforts',
        'Document alternatives used',
        'Share tips and challenges faced'
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
  };

  const renderInstructionsModal = (challenge: any) => (
    <AnimatePresence>
      {showInstructions && (
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
            className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-eco-primary">{challenge.title} Instructions</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-eco-primary mb-2">Step-by-Step Guide</h4>
                <ol className="space-y-3">
                  {challenge.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-eco-accent rounded-full flex items-center justify-center text-eco-primary font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-eco-primary mb-2">Helpful Tips</h4>
                <ul className="space-y-2">
                  {challenge.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600">
                      <Star className="h-4 w-4 text-eco-secondary" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-eco-primary mb-2">Verification Requirements</h4>
                <ul className="space-y-2">
                  {challenge.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600">
                      <CheckCircle className="h-4 w-4 text-eco-secondary" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                setShowInstructions(false);
                handleJoinChallenge(challenge.id);
              }}
              className="w-full mt-6 bg-eco-primary text-white py-3 rounded-lg hover:bg-eco-secondary flex items-center justify-center space-x-2"
            >
              <span>Start Challenge</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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
                    <button
                      onClick={() => setShowInstructions(true)}
                      className="text-eco-primary hover:text-eco-secondary"
                    >
                      <Info className="h-5 w-5" />
                    </button>
                  </div>

                  {renderVerificationSection(challenge)}

                  <div className="mt-4 space-y-4">
                    <div className="bg-eco-background rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-eco-primary h-full rounded-full transition-all duration-500"
                        style={{ width: '45%' }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md: <boltAction type="file" filePath="src/components/Challenges.tsx">grid-cols-2 gap-4">
                      {challenge.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            milestone.completed ? 'bg-eco-accent/20' : 'bg-eco-background'
                          }`}
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-eco-accent rounded-lg">
                      <challenge.icon className="h-6 w-6 text-eco-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-eco-primary">{challenge.title}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {challenge.difficulty}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                <div className="space-y-3">
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
                    <span className="text-gray-600">Participants:</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-eco-secondary" />
                      <span className="font-semibold">{challenge.participants}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-eco-background border-t border-gray-100">
                <h4 className="font-semibold text-eco-primary mb-2">Requirements:</h4>
                <ul className="space-y-2">
                  {challenge.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-eco-secondary flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => setShowInstructions(true)}
                  className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                    isJoined
                      ? 'bg-eco-secondary text-white hover:bg-eco-primary'
                      : 'bg-eco-primary text-white hover:bg-eco-secondary'
                  }`}
                >
                  {isJoined ? 'View Progress' : 'Start Challenge'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {challenges.map(challenge => renderInstructionsModal(challenge))}
    </div>
  );
};

export default Challenges;