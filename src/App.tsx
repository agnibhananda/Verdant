import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Challenges from './components/Challenges';
import Community from './components/Community';
import Profile from './components/Profile';
import { LoadingScreen } from './components/LoadingScreen';
import { Image } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <Router>
      <AnimatePresence>
        {loading ? (
          <LoadingScreen />
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
                  <img src="/logo.png" alt="Verdant Logo" className="h-8 w-8" />
                  <h1 className="text-2xl font-bold">Verdant</h1>
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