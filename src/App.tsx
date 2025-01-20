import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Challenges from './components/Challenges';
import Community from './components/Community';
import Profile from './components/Profile';
import { LoadingScreen } from './components/LoadingScreen';
import { supabase } from './lib/supabase';

function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <Router>
      <div className="min-h-screen bg-eco-background flex flex-col">
        <motion.header
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-eco-primary text-white p-4 sticky top-0 z-50 shadow-lg"
        >
          <div className="container mx-auto flex items-center justify-between px-4">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Verdant Logo" className="h-8 w-8" />
                <h1 className="text-xl md:text-2xl font-bold">Verdant</h1>
              </a>
            </motion.div>
            <Navigation />
          </div>
        </motion.header>

        <main className="flex-grow container mx-auto px-4 py-4 md:py-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <motion.div
                    key="dashboard"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
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
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
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
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
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
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Profile />
                  </motion.div>
                } 
              />
            </Routes>
          </AnimatePresence>
        </main>

        <motion.footer 
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="bg-eco-primary text-white py-4 md:py-6 mt-auto"
        >
          <div className="container mx-auto px-4 text-center text-sm md:text-base">
            <p>© 2025 Verdant. Making the world greener, one challenge at a time.</p>
          </div>
        </motion.footer>
      </div>
    </Router>
  );
}

export default App;