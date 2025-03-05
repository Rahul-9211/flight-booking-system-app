'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeToggle() {
  const { mode, isDark, toggleMode, setMode } = useThemeStore();
  
  // Initialize theme on component mount
  useEffect(() => {
    // Check if we need to listen for system preference changes
    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setMode('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Apply current theme
    setMode(mode);
  }, [mode, setMode]);
  
  return (
    <motion.button 
      onClick={toggleMode}
      className="relative w-14 h-7 rounded-full overflow-hidden flex items-center justify-between px-1.5 border border-white/10"
      style={{
        background: isDark 
          ? 'linear-gradient(to right, rgba(0, 229, 255, 0.1), rgba(123, 104, 238, 0.1))'
          : 'linear-gradient(to right, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sun icon */}
      <motion.div 
        className="text-xs"
        initial={{ opacity: isDark ? 0.3 : 1 }}
        animate={{ opacity: isDark ? 0.3 : 1 }}
        transition={{ duration: 0.2 }}
      >
        ☀️
      </motion.div>
      
      {/* Moon icon */}
      <motion.div 
        className="text-xs"
        initial={{ opacity: isDark ? 1 : 0.3 }}
        animate={{ opacity: isDark ? 1 : 0.3 }}
        transition={{ duration: 0.2 }}
      >
        🌙
      </motion.div>
      
      {/* Toggle slider */}
      <motion.div 
        className="absolute w-5 h-5 rounded-full shadow-md flex items-center justify-center"
        style={{
          background: isDark 
            ? 'linear-gradient(to right, #00e5ff, #7b68ee)' 
            : 'linear-gradient(to right, #ffd700, #ffa500)'
        }}
        initial={{ x: isDark ? 1 : 27 }}
        animate={{ x: isDark ? 1 : 27 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
      />
      
      {/* Circuit board pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full opacity-20">
          <motion.div 
            className="absolute top-1/2 left-0 w-full h-[1px]"
            style={{ background: isDark ? 'rgba(0, 229, 255, 0.5)' : 'rgba(255, 215, 0, 0.5)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/4 left-0 w-1/2 h-[1px]"
            style={{ background: isDark ? 'rgba(0, 229, 255, 0.3)' : 'rgba(255, 215, 0, 0.3)' }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-0 w-1/2 h-[1px]"
            style={{ background: isDark ? 'rgba(123, 104, 238, 0.3)' : 'rgba(255, 165, 0, 0.3)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
          />
        </div>
      </div>
    </motion.button>
  );
} 