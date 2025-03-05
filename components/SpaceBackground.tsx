'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDuration: number;
}

export function SpaceBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars: Star[] = [];
      const count = Math.floor(window.innerWidth * window.innerHeight / 1000);
      
      for (let i = 0; i < count; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          animationDuration: Math.random() * 10 + 10
        });
      }
      
      setStars(newStars);
    };
    
    generateStars();
    
    // Regenerate stars on window resize
    window.addEventListener('resize', generateStars);
    return () => window.removeEventListener('resize', generateStars);
  }, []);
  
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0a0a2e] via-[#050816] to-[#030308]"></div>
      
      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.5, star.opacity]
          }}
          transition={{
            duration: star.animationDuration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Nebula effects */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-secondary/5 blur-3xl"></div>
    </div>
  );
} 