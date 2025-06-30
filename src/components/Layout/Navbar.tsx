import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, User, LogOut, Gift } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/donate', label: 'Donate' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/impact', label: 'Our Impact' },
    { path: '/volunteer', label: 'Volunteer' },
  ];

  const handleSignOut = async () => {
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      console.log('Signing out...');
      console.log('Current user:', user?.email);
      console.log('Current profile:', profile);
      setIsSigningOut(true);
      // Failsafe: always clear loading after 5 seconds
      timeoutId = setTimeout(() => {
        setIsSigningOut(false);
        console.error('Sign out timed out after 5 seconds');
        alert('Sign out is taking too long. Please refresh the page.');
      }, 5000);
      await signOut();
      setIsOpen(false);
      console.log('Sign out completed successfully');
      navigate('/');
      setTimeout(() => {
        console.log('After signOut, user:', user);
        console.log('After signOut, profile:', profile);
      }, 500);
    } catch (error) {
      console.error('Error signing out:', error);
      setIsOpen(false);
      navigate('/');
      setTimeout(() => {
        console.log('After signOut error, user:', user);
        console.log('After signOut error, profile:', profile);
      }, 500);
      alert('An error occurred during sign out. Please try again.');
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-orange rounded-xl"
            >
              <Heart className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-slate group-hover:text-orange transition-colors">
              Share & Care
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-orange'
                    : 'text-slate hover:text-orange'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange"
                    initial={false}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {profile && (
                  <div className="flex items-center space-x-2 bg-cream px-3 py-2 rounded-xl">
                    <Gift className="h-4 w-4 text-orange" />
                    <span className="text-sm font-medium text-slate">
                      {profile.care_points || 0} pts
                    </span>
                  </div>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 bg-orange text-white rounded-xl hover:bg-orange-light transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="p-2 text-slate hover:text-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                >
                  <LogOut className={`h-5 w-5 ${isSigningOut ? 'animate-spin' : ''}`} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate hover:text-orange transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-orange text-white rounded-xl hover:bg-orange-light transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate hover:text-orange hover:bg-cream transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-cream"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-orange bg-cream'
                      : 'text-slate hover:text-orange hover:bg-cream'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <div className="pt-4 border-t border-cream space-y-3">
                  {profile && (
                    <div className="flex items-center justify-between px-3 py-2 bg-cream rounded-xl">
                      <span className="text-sm text-slate">CarePoints</span>
                      <span className="text-sm font-bold text-orange">
                        {profile.care_points || 0}
                      </span>
                    </div>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 bg-orange text-white text-center rounded-xl"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="block w-full px-3 py-2 text-slate text-center hover:text-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                  >
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-cream space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-center text-slate hover:text-orange transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 bg-orange text-white text-center rounded-xl"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
