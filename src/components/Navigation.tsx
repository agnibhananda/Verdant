import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Award, Users, User } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/challenges', icon: Award, label: 'Challenges' },
    { to: '/community', icon: Users, label: 'Community' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="flex items-center space-x-6">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center space-x-2 hover:text-eco-accent transition-colors ${
              isActive ? 'text-eco-accent' : 'text-white'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;