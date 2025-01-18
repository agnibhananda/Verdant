import React, { useState } from 'react';
import { Calendar, Droplet, Zap, Recycle, Camera, Users, MapPin, Phone } from 'lucide-react';
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
      ]
    },
    {
      id: '3',
      icon: Recycle,
      title: 'Zero Waste Challenge',
      description: 'Produce zero non-recyclable waste for an entire week. Sustainable Living Transformation',
      category: 'waste',
      points: 750,
      difficulty: 'Hard',
      participants: 892,
      verificationMethod: 'location',
      requirements: [
        'Track all waste produced',
        'Visit recycling center',
        'Submit photo evidence of waste reduction'
      ]
    },
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
    switch (method) {
      case 'photo':
        setVerificationData(prev => ({
          ...prev,
          [challengeId]: { status: 'pending', proof: 'Photo submitted for review' }
        }));
        break;
      case 'peer':
        setVerificationData(prev => ({
          ...prev,
          [challengeId]: { status: 'pending', proof: 'Peer verification requested' }
        }));
        break;
      case 'location':
        setVerificationData(prev => ({
          ...prev,
          [challengeId]: { status: 'pending', proof: 'Location verification in progress' }
        }));
        break;
    }
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
        <h2 className="text-3xl font-bold text-eco-primary">Monthly Challenges</h2>
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
          <h3 className="text-xl font-bold text-eco-primary mb-4">Current Challenges</h3>
          <div className="space-y-4">
            {challenges
              .filter(challenge => joinedChallenges.includes(challenge.id))
              .map(challenge => (
                <div key={`active-${challenge.id}`} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-eco-primary">{challenge.title}</h4>
                    <span className="text-sm text-gray-600">
                      {verificationData[challenge.id]?.status || 'Not verified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <VerificationIcon method={challenge.verificationMethod} />
                      <span>Verify via {challenge.verificationMethod}</span>
                    </div>
                    <button
                      onClick={() => handleVerification(challenge.id, challenge.verificationMethod)}
                      className="bg-eco-secondary text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Submit Verification
                    </button>
                  </div>
                  {verificationData[challenge.id]?.proof && (
                    <p className="text-sm text-gray-600 mt-2">
                      {verificationData[challenge.id].proof}
                    </p>
                  )}
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
                    <span className="font-semibold">{challenge.points}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-semibold">{challenge.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-semibold">{(challenge.participants + (isJoined ? 1 : 0)).toLocaleString()}</span>
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
                {isJoined ? 'Leave' : 'View Details'}
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
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
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