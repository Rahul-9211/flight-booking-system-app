'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              <span className="text-primary">SPACE</span>VOYAGE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <ul className="flex space-x-1">
              <motion.li
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/" 
                  className={`px-4 py-2 rounded-lg ${pathname === '/' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  Home
                </Link>
              </motion.li>
              <motion.li
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/flights" 
                  className={`px-4 py-2 rounded-lg ${pathname === '/flights' || pathname.startsWith('/flights/') ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  Flights
                </Link>
              </motion.li>
            </ul>
            
            <div className="ml-4 flex items-center space-x-2">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-white/5"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                      {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:inline-block">{user?.full_name || 'User'}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm hover:bg-white/5"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            href="/bookings"
                            className="block px-4 py-2 text-sm hover:bg-white/5"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Bookings
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-white/5 text-red-400"
                          >
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/signin" 
                      className={`px-4 py-2 rounded-lg ${pathname === '/signin' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/signup" 
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/5 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/80 backdrop-blur-md overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md ${
                  pathname === '/' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/flights"
                className={`block px-3 py-2 rounded-md ${
                  pathname === '/flights' || pathname.startsWith('/flights/')
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Flights
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className={`block px-3 py-2 rounded-md ${
                      pathname === '/profile' ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/bookings"
                    className={`block px-3 py-2 rounded-md ${
                      pathname === '/bookings' ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-red-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className={`block px-3 py-2 rounded-md ${
                      pathname === '/signin' ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className={`block px-3 py-2 rounded-md ${
                      pathname === '/signup' ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 