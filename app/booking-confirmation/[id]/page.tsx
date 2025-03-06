'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import ConfettiExplosion from 'react-confetti-explosion';
import { bookingService } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function BookingConfirmationPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isExploding, setIsExploding] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingService.getBookingById(id);
        setBooking(data);
      } catch (err: any) {
        console.error('Error fetching booking:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooking();
  }, [id]);
  
  // Start confetti effect when page loads
  useEffect(() => {
    setIsExploding(true);
    
    // Stop confetti after 3 seconds
    const timer = setTimeout(() => {
      setIsExploding(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Redirect to bookings page when countdown reaches 0
      router.push('/bookings');
    }
  }, [countdown, router]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="glass-effect rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
          <p className="mb-6">{error}</p>
          <Link 
            href="/bookings"
            className="px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 rounded-lg inline-block hover:from-primary/30 hover:to-secondary/30"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {isExploding && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <ConfettiExplosion
            force={0.8}
            duration={3000}
            particleCount={250}
            width={1600}
          />
        </div>
      )}
      
      <motion.div 
        className="glass-effect rounded-xl p-8 text-center relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10" // Ensure content stays visible
        >
          <div className="mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3
              }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 futuristic-text">BOOKING CONFIRMED</h1>
          
          <p className="text-xl mb-6">
            Your flight has been successfully booked!
          </p>
          
          <div className="mb-6">
            <p className="text-white/70 mb-2">Booking Reference:</p>
            <p className="text-xl font-mono bg-white/5 py-2 px-4 rounded-lg inline-block">{id}</p>
          </div>
          
          {booking && (
            <div className="max-w-md mx-auto mb-8">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'} text-left`}>
                <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-white/70">Flight:</div>
                  <div>{booking.flight?.flight_number || 'N/A'}</div>
                  
                  <div className="text-white/70">From:</div>
                  <div>{booking.flight?.origin || 'N/A'}</div>
                  
                  <div className="text-white/70">To:</div>
                  <div>{booking.flight?.destination || 'N/A'}</div>
                  
                  <div className="text-white/70">Date:</div>
                  <div>{booking.flight?.departure_time 
                    ? new Date(booking.flight.departure_time).toLocaleDateString() 
                    : 'N/A'}</div>
                  
                  <div className="text-white/70">Passengers:</div>
                  <div>{booking.number_of_seats || 1}</div>
                  
                  <div className="text-white/70">Status:</div>
                  <div className="text-green-400 font-medium">Confirmed</div>
                </div>
                
                <div className="text-sm text-white/60 text-center">
                  You will be redirected to your bookings in <span className="font-bold text-primary">{countdown}</span> seconds
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/bookings"
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg inline-block"
            >
              View My Bookings
            </Link>
            
            <Link 
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 rounded-lg inline-block hover:from-primary/30 hover:to-secondary/30"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
        
        {/* Background decorative elements that won't affect content visibility */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </div>
      </motion.div>
    </div>
  );
} 