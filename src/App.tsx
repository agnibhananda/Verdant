import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Challenges from './components/Challenges';
import Community from './components/Community';
import Profile from './components/Profile';
import { LoadingScreen } from './components/LoadingScreen';
import { Onboarding } from './components/Onboarding';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';

function App() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkOnboardingStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await checkOnboardingStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboardingStatus = async (userId: string) => {
    try {
      // First, check if the user has preferences
      const { data: existingPrefs, error: selectError } = await supabase
        .from('user_preferences')
        .select('onboarding_completed')
        .eq('user_id', userId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      // If no preferences exist, create them
      if (!existingPrefs) {
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert([
            { 
              user_id: userId, 
              onboarding_completed: false 
            }
          ])
          .single();

        if (insertError) throw insertError;
        setShowOnboarding(true);
      } else {
        setShowOnboarding(!existingPrefs.onboarding_completed);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Only show onboarding if we can't verify the status
      setShowOnboarding(true);
    }
  };

  const handleAuthSuccess = async (userId: string) => {
    await checkOnboardingStatus(userId);
  };

  const handleOnboardingComplete = async (data: any) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ onboarding_completed: true })
        .eq('user_id', session.user.id);

      if (error) throw error;
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
  };

  const handleOnboardingSkip = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ onboarding_completed: true })
        .eq('user_id', session.user.id);

      if (error) throw error;
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Router>
      <AnimatePresence>
        {showOnboarding ? (
          <Onboarding
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-eco-background"
          >
            <motion.header
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="bg-eco-primary text-white p-4 sticky top-0 z-10"
            >
              <div className="container mx-auto flex items-center justify-between">
                <motion.div
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <a href="/">
                    <img src="/logo.png" alt="Verdant Logo" className="h-8 w-8" />
                  </a>
                  <a href="/">
                    <h1 className="text-2xl font-bold">Verdant</h1>
                  </a>
                </motion.div>
                <Navigation />
              </div>
            </motion.header>

            <main className="container mx-auto px-4 py-8">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <motion.div
                        key="dashboard"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <Dashboard />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/challenges"
                    element={
                      <motion.div
                        key="challenges"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <Challenges />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/community"
                    element={
                      <motion.div
                        key="community"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <Community />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <motion.div
                        key="profile"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <Profile />
                      </motion.div>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </main>

            <footer className="bg-eco-primary text-white py-6 mt-auto">
              <div className="container mx-auto px-4 text-center">
                <p>© 2025 Verdant. Making the world greener, one challenge at a time.</p>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;