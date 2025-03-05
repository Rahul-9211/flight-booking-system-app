'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function LoadUser() {
  const { loadUser, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        await loadUser();
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    if (!isInitialized && !isLoading) {
      initAuth();
    }
  }, [loadUser, isLoading, isInitialized]);
  
  return null; // This component doesn't render anything
} 