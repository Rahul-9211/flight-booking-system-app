'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold futuristic-text">COSMIC FLIGHTS</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/flights" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/flights') 
                    ? 'text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Flights
              </Link>
              <Link 
                href="/bookings" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/bookings') 
                    ? 'text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                My Bookings
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              
              <Link 
                href="/signin" 
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign In
              </Link>
              
              <Link 
                href="/signup" 
                className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/flights" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/flights') 
                    ? 'text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Flights
              </Link>
              <Link 
                href="/bookings" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/bookings') 
                    ? 'text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </Link>
              
              <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link 
                  href="/signin" 
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                
                <Link 
                  href="/signup" 
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-center bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 