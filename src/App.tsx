import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Challenges from './components/Challenges';
import Community from './components/Community';
import Profile from './components/Profile';
import { Leaf } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-eco-background">
        <header className="bg-eco-primary text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8" />
              <h1 className="text-2xl font-bold">EcoChallenge Champions</h1>
            </div>
            <Navigation />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <footer className="bg-eco-primary text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>© 2024 EcoChallenge Champions. Making the world greener, one challenge at a time.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;