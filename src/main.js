import './style.css';
import { initDashboard } from './pages/dashboard.js';
import { initChallenges } from './pages/challenges.js';
import { initCommunity } from './pages/community.js';
import { initProfile } from './pages/profile.js';

// Initialize Lucide icons
lucide.createIcons();

// Page navigation
const pages = ['dashboard', 'challenges', 'community', 'profile'];
const navLinks = document.querySelectorAll('.nav-link');

function showPage(pageId) {
  pages.forEach(page => {
    const element = document.getElementById(page);
    const link = document.querySelector(`[data-page="${page}"]`);
    
    if (page === pageId) {
      element.classList.add('active');
      link.classList.add('active');
    } else {
      element.classList.remove('active');
      link.classList.remove('active');
    }
  });
}

// Handle navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = link.getAttribute('data-page');
    showPage(pageId);
    window.location.hash = pageId;
  });
});

// Initialize pages
initDashboard();
initChallenges();
initCommunity();
initProfile();

// Handle initial route
const initialPage = window.location.hash.slice(1) || 'dashboard';
showPage(initialPage);