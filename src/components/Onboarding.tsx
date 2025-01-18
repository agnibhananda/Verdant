import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Home, ShoppingBag, ArrowRight, ArrowLeft, Check, X, Database, Lightbulb } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

interface OnboardingProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip }) => {
  // ... previous state and steps code remains the same ...

  return (
    <div className="fixed inset-0 bg-eco-background flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-eco-accent rounded-lg">
              <StepIcon className="h-6 w-6 text-eco-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-eco-primary">{steps[step].title}</h3>
              <p className="text-sm text-gray-600">{steps[step].description}</p>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip Setup
          </button>
        </div>

        <div className="mb-8">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full transition-colors ${
                  index === step ? 'bg-eco-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex space-x-4">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-eco-primary text-white px-4 py-2 rounded-lg hover:bg-eco-secondary transition-colors"
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