'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { bookingService } from '@/lib/api';

interface BookingIntent {
  flightId: string;
  passengers: number;
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Clear errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);
  
  // Handle post-authentication actions
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Check if there's a booking intent in localStorage
      const storedBookingIntent = localStorage.getItem('bookingIntent');
      
      if (storedBookingIntent) {
        try {
          const bookingIntent: BookingIntent = JSON.parse(storedBookingIntent);
          
          // Create the booking
          const createBooking = async () => {
            try {
              const bookingData = {
                flight_id: bookingIntent.flightId,
                number_of_seats: bookingIntent.passengers,
                payment_method: "credit_card"
              };
              
              const response = await bookingService.createBooking(bookingData);
              const booking = response.data;
              
              // Clear the booking intent from localStorage
              localStorage.removeItem('bookingIntent');
              
              // Redirect to the booking page
              router.push(`/bookings/${booking.id}`);
            } catch (err) {
              console.error('Error creating booking after login:', err);
              // If booking creation fails, redirect to the flight details page
              router.push(`/flights/${bookingIntent.flightId}`);
            }
          };
          
          createBooking();
        } catch (err) {
          console.error('Error processing booking intent:', err);
          router.push(returnUrl);
        }
      } else {
        // No booking intent, just redirect to the return URL
        router.push(returnUrl);
      }
    }
  }, [isAuthenticated, isLoading, router, returnUrl]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (formError) setFormError(null);
    if (error) clearError();
  };
  
  const validateForm = () => {
    if (!formData.email) {
      setFormError('Email is required');
      return false;
    }
    
    if (!formData.password) {
      setFormError('Password is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setFormError(null);
    clearError();
    
    // Validate form
    if (!formData.email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    if (!formData.password.trim()) {
      setFormError('Password is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
      router.push(returnUrl);
    } catch (err: any) {
      // Display the error message from the API
      setFormError(err.message || 'Sign in failed. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show global loading state
  if (isLoading && !isSubmitting) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div 
        className="glass-effect rounded-xl p-8 neon-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center futuristic-text">SIGN IN</h1>
        
        {(formError || error) && (
          <motion.div 
            className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {formError || error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-white/80">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-white/80">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-primary hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 