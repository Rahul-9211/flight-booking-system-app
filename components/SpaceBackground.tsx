'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDuration: number;
  delay: number;
}

export default function SpaceBackground() {
  const { isDark } = useThemeStore();
  
  // Remove all complex logic temporarily
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
      {/* Simple background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark 
            ? 'radial-gradient(circle at center, #0a0a2e 0%, #050816 50%, #030308 100%)' 
            : 'radial-gradient(circle at center, #b3e0ff 0%, #f0f8ff 50%, #e6f0ff 100%)'
        }}
      />
    </div>
  );
} 