'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PassengerSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function PassengerSelector({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  className = '',
}: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate passenger options
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // Get display text
  const getDisplayText = () => {
    return `${value} ${value === 1 ? 'Passenger' : 'Passengers'}`;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="block text-sm text-white/70 mb-1">{label}</label>
      
      <div 
        className="flex items-center glass-effect rounded-lg px-4 py-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 truncate">
          {getDisplayText()}
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && (
        <div 
          className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50"
          style={{ top: '100%' }}
        >
          {options.map((num) => (
            <div
              key={num}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                num === value ? 'bg-gray-800' : ''
              }`}
              onClick={() => {
                onChange(num);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <span>{num} {num === 1 ? 'Passenger' : 'Passengers'}</span>
                {num === value && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 