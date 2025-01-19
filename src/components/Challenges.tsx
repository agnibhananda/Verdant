import React, { useState } from 'react';
import { Calendar, Droplet, Zap, Recycle, Camera, Users, MapPin, Phone, CheckCircle, Clock, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Challenges = () => {
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [verificationData, setVerificationData] = useState<Record<string, { status: string; proof: string }>>({});

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
      verificationMethod: 'peer',
      requirements: [
        'Document electricity-free activities',
        'Get verification from two community members',
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
      verificationMethod: 'location',
      requirements: [
        'Track all waste produced',
        'Visit recycling center',
        'Submit photo evidence of waste reduction'
      ],
      milestones: [
        { title: 'Start Challenge', points: 75, completed: false },
        { title: 'First Day Zero Waste', points: 200, completed: false },
        { title: 'Visit Recycling Center', points: 175, completed: false },
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

  const handleVerification = (challengeId: string, method: string) => {
    setVerificationData(prev => ({
      ...prev,
      [challengeId]: { 
        status: 'pending',
        proof: `${method === 'photo' ? 'Photo' : method === 'peer' ? 'Peer verification' : 'Location'} submitted for review`
      }
    }));
  };

  const VerificationIcon = ({ method }: { method: string }) => {
    switch (method) {
      case 'photo':
        return <Camera className="h-5 w-5" />;
      case 'peer':
        return <Users className="h-5 w-5" />;
      case 'location':
        return <MapPin className="h-5 w-5" />;
      default:
        return null;
    }
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">
                        {verificationData[challenge.id]?.status || 'Not verified'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Progress bar */}
                    <div className="bg-eco-background rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-eco-primary h-full rounded-full transition-all duration-500"
                        style={{ width: '45%' }}
                      />
                    </div>

                    {/* Milestones */}
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

                    {/* Tips */}
                    <div className="bg-eco-accent/10 rounded-lg p-4">
                      <h5 className="font-medium text-eco-primary mb-2">Pro Tips</h5>
                      <ul className="space-y-2">
                        {challenge.tips.map((tip, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <Zap className="h-4 w-4 text-eco-secondary" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Verification */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <VerificationIcon method={challenge.verificationMethod} />
                        <span>Verify via {challenge.verificationMethod}</span>
                      </div>
                      <button
                        onClick={() => handleVerification(challenge.id, challenge.verificationMethod)}
                        className="bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary transition-colors"
                      >
                        Submit Verification
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
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
                      <span className="font-semibold">{(challenge.participants + (isJoined ? 1 : 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={isJoined ? () => handleJoinChallenge(challenge.id) : () => setSelectedChallenge(challenge)}
                className={`w-full py-3 font-semibold transition-colors ${
                  isJoined
                    ? 'bg-eco-secondary text-white hover:bg-eco-primary'
                    : 'bg-eco-primary text-white hover:bg-eco-secondary'
                }`}
              >
                {isJoined ? 'Leave Challenge' : 'View Details'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-eco-accent rounded-lg">
                  <selectedChallenge.icon className="h-6 w-6 text-eco-primary" />
                </div>
                <h3 className="text-2xl font-bold text-eco-primary">{selectedChallenge.title}</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-eco-primary mb-2">Description</h4>
                  <p className="text-gray-600">{selectedChallenge.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-eco-primary mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {selectedChallenge.requirements.map((req: string, index: number) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-eco-primary mb-2">Milestones</h4>
                  <div className="space-y-3">
                    {selectedChallenge.milestones.map((milestone: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-600">{milestone.title}</span>
                        <span className="font-medium text-eco-primary">+{milestone.points} points</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-eco-primary mb-2">Verification Method</h4>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <VerificationIcon method={selectedChallenge.verificationMethod} />
                    <span className="capitalize">{selectedChallenge.verificationMethod} verification required</span>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleJoinChallenge(selectedChallenge.id)}
                    className="flex-1 py-3 bg-eco-primary text-white font-semibold rounded-lg hover:bg-eco-secondary transition-colors"
                  >
                    Join Challenge
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Challenges;