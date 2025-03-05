'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout, loadUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Flights', path: '/flights' },
    ...(isAuthenticated 
      ? [
          { name: 'My Bookings', path: '/bookings' },
          { name: 'My Profile', path: '/profile' }
        ] 
      : [])
  ];

  return (
    <nav className="glass-effect sticky top-0 z-50 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center"
          >
            <span className="text-white text-xs">✈️</span>
          </motion.div>
          <span className="text-xl font-bold futuristic-text animated-gradient-text">
            COSMIC FLIGHTS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path}
                  className={`relative px-2 py-1 transition-colors ${
                    pathname === link.path 
                      ? 'text-primary font-medium' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.name}
                  {pathname === link.path && (
                    <motion.span 
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80">
                Hello, {user?.full_name.split(' ')[0]}
              </span>
              <button 
                onClick={logout}
                className="px-4 py-2 rounded-full text-sm bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-white/10 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link 
                href="/signin" 
                className="px-4 py-2 rounded-full text-sm hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="px-4 py-2 rounded-full text-sm bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden glass-effect mt-4 rounded-lg overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path}
                  className={`block px-6 py-3 ${
                    pathname === link.path 
                      ? 'text-primary bg-white/5' 
                      : 'text-white/80'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <li>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-6 py-3 text-white/80"
                >
                  Sign Out
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link 
                    href="/signin"
                    className="block px-6 py-3 text-white/80"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/signup"
                    className="block px-6 py-3 text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </motion.div>
      )}
    </nav>
  );
} 