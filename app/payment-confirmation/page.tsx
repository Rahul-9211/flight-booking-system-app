'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Suspense } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ConfettiExplosion from 'react-confetti-explosion';

// Component that uses useSearchParams
function PaymentConfirmationContent() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('status') || 'success';
  const paymentId = searchParams.get('payment_id') || '';
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isExploding, setIsExploding] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  // Start confetti effect when page loads
  useEffect(() => {
    if (paymentStatus === 'success') {
      setIsExploding(true);
      
      // Stop confetti after 3 seconds
      const timer = setTimeout(() => {
        setIsExploding(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);
  
  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && paymentStatus === 'success') {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0 && paymentStatus === 'success') {
      router.push('/bookings');
    }
  }, [countdown, router, paymentStatus]);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        className="max-w-2xl mx-auto glass-effect rounded-xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isExploding && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <ConfettiExplosion 
              force={0.8}
              duration={3000}
              particleCount={100}
              width={1600}
            />
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          {paymentStatus === 'success' ? (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-white/70 mb-6">Your booking has been confirmed.</p>
              
              <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-white/70">Payment ID:</div>
                  <div className="font-mono">{paymentId}</div>
                  
                  <div className="text-white/70">Status:</div>
                  <div className="text-green-400 font-medium">Confirmed</div>
                </div>
                
                <div className="text-sm text-white/60 text-center mt-4">
                  You will be redirected to your bookings in <span className="font-bold text-primary">{countdown}</span> seconds
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
              <p className="text-white/70 mb-6">There was an issue processing your payment.</p>
              
              <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white/70 mb-2">
                  Please try again or contact customer support if the problem persists.
                </p>
              </div>
            </>
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

// Main page component with Suspense boundary
export default function PaymentConfirmation() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>}>
      <PaymentConfirmationContent />
    </Suspense>
  );
} 