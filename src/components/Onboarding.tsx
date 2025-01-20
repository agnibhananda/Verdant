import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Home, ShoppingBag, ArrowRight, ArrowLeft, Check, X, Database, Lightbulb } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

interface OnboardingProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    transport: {
      car: false,
      publicTransport: false,
      bike: false,
      walk: false
    },
    home: {
      houseType: '',
      occupants: '1',
      renewable: false
    },
    consumption: {
      meatConsumption: 'medium',
      shopping: 'medium',
      recycling: false
    },
    dataSources: {
      smartHome: false,
      fitnessTacker: false,
      smartCar: false
    }
  });

  const steps = [
    {
      title: "Welcome to Verdant",
      description: "Let's create your personalized sustainability journey",
      icon: Lightbulb,
      type: 'welcome'
    },
    {
      title: "Transportation Habits",
      description: "How do you usually get around?",
      icon: Car,
      type: 'transport'
    },
    {
      title: "Home & Energy",
      description: "Tell us about your living situation",
      icon: Home,
      type: 'home'
    },
    {
      title: "Consumption Patterns",
      description: "Let's understand your daily habits",
      icon: ShoppingBag,
      type: 'consumption'
    },
    {
      title: "Connect Data Sources",
      description: "Enhance your experience with smart tracking",
      icon: Database,
      type: 'dataSources'
    }
  ];

  const handleNext = () => {
    if (step === steps.length - 1) {
      const submissionData = {
        ...formData,
        home: {
          ...formData.home,
          occupants: parseInt(formData.home.occupants, 10)
        }
      };
      onComplete(submissionData);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleOccupantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || parseInt(value, 10) > 0) {
      setFormData(prev => ({
        ...prev,
        home: { ...prev.home, occupants: value }
      }));
    }
  };

  const renderStepContent = () => {
    switch (steps[step].type) {
      case 'welcome':
        return (
          <div className="text-center space-y-6 px-4">
            <img src="/logo.png" alt="Verdant Logo" className="w-20 h-20 md:w-24 md:h-24 mx-auto" />
            <h2 className="text-xl md:text-2xl font-bold text-eco-primary">Welcome to Verdant</h2>
            <p className="text-sm md:text-base text-gray-600">
              Join our community of eco-conscious individuals making a difference.
              Let's start by understanding your current lifestyle.
            </p>
          </div>
        );

      case 'transport':
        return (
          <div className="space-y-4 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(formData.transport).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    transport: { ...prev.transport, [key]: !value }
                  }))}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    value ? 'border-eco-primary bg-eco-accent' : 'border-gray-200'
                  }`}
                >
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="space-y-4 px-4">
            <select
              value={formData.home.houseType}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                home: { ...prev.home, houseType: e.target.value }
              }))}
              className="w-full p-2 border-2 rounded-lg"
            >
              <option value="">Select house type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base">Number of occupants:</span>
              <input
                type="number"
                min="1"
                value={formData.home.occupants}
                onChange={handleOccupantsChange}
                className="w-20 p-2 border-2 rounded-lg"
              />
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.home.renewable}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  home: { ...prev.home, renewable: e.target.checked }
                }))}
              />
              <span className="text-sm md:text-base">I use renewable energy</span>
            </label>
          </div>
        );

      case 'consumption':
        return (
          <div className="space-y-4 px-4">
            <div className="space-y-2">
              <label className="block text-sm md:text-base">Meat consumption:</label>
              <select
                value={formData.consumption.meatConsumption}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  consumption: { ...prev.consumption, meatConsumption: e.target.value }
                }))}
                className="w-full p-2 border-2 rounded-lg"
              >
                <option value="low">Low (0-2 times/week)</option>
                <option value="medium">Medium (3-5 times/week)</option>
                <option value="high">High (6+ times/week)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm md:text-base">Shopping frequency:</label>
              <select
                value={formData.consumption.shopping}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  consumption: { ...prev.consumption, shopping: e.target.value }
                }))}
                className="w-full p-2 border-2 rounded-lg"
              >
                <option value="low">Low (essential only)</option>
                <option value="medium">Medium (occasional)</option>
                <option value="high">High (frequent)</option>
              </select>
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.consumption.recycling}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  consumption: { ...prev.consumption, recycling: e.target.checked }
                }))}
              />
              <span className="text-sm md:text-base">I regularly recycle</span>
            </label>
          </div>
        );

      case 'dataSources':
        return (
          <div className="space-y-4 px-4">
            {Object.entries(formData.dataSources).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dataSources: { ...prev.dataSources, [key]: e.target.checked }
                  }))}
                />
                <span className="text-sm md:text-base capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
            <p className="text-xs md:text-sm text-gray-600 mt-2">
              Connecting data sources helps us provide more accurate recommendations
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const StepIcon = steps[step].icon;

  return (
    <div className="fixed inset-0 bg-eco-background flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-eco-accent rounded-lg">
              <StepIcon className="h-5 w-5 md:h-6 md:w-6 text-eco-primary" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-eco-primary">{steps[step].title}</h3>
              <p className="text-xs md:text-sm text-gray-600">{steps[step].description}</p>
            </div>
          </div>
          {step > 0 && (
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}
        </div>

        <div className="mb-8">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center px-4">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-6 md:w-8 rounded-full ${
                  index === step ? 'bg-eco-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex space-x-4">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden md:inline">Back</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary"
            >
              <span>{step === steps.length - 1 ? 'Complete' : 'Next'}</span>
              {step === steps.length - 1 ? (
                <Check className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};