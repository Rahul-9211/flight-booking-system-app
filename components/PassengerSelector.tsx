'use client';

import { useState, useRef, useEffect } from 'react';

interface PassengerSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  darkMode?: boolean;
}

export default function PassengerSelector({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  className = '',
  darkMode = true
}: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic classes based on dark/light mode
  const labelClass = darkMode ? "text-white/70" : "text-gray-700";
  const inputBgClass = darkMode ? "glass-effect" : "bg-white border border-gray-300";
  const inputTextClass = darkMode ? "text-white" : "text-gray-800";
  const dropdownBgClass = darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300";
  const buttonBgClass = darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200";
  const buttonTextClass = darkMode ? "text-white" : "text-gray-800";

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

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className={`block text-sm ${labelClass} mb-1`}>{label}</label>
      
      <div 
        className={`flex items-center justify-between ${inputBgClass} rounded-lg px-4 py-3 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={inputTextClass}>
          {value} {value === 1 ? 'Passenger' : 'Passengers'}
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${darkMode ? 'text-white' : 'text-gray-500'}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && (
        <div 
          className={`absolute left-0 right-0 mt-1 ${dropdownBgClass} border rounded-lg shadow-lg z-50`}
          style={{ top: '100%' }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={inputTextClass}>Number of Passengers</span>
              <span className={`font-medium ${inputTextClass}`}>{value}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                className={`${buttonBgClass} ${buttonTextClass} w-10 h-10 rounded-full flex items-center justify-center focus:outline-none`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecrement();
                }}
                disabled={value <= min}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="flex-1 mx-4">
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value))}
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              <button
                type="button"
                className={`${buttonBgClass} ${buttonTextClass} w-10 h-10 rounded-full flex items-center justify-center focus:outline-none`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncrement();
                }}
                disabled={value >= max}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 