'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

interface PaymentConfirmationProps {
  paymentId: string;
  amount: number;
  bookingId: string;
}

export default function PaymentConfirmation({ paymentId, amount, bookingId }: PaymentConfirmationProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg p-6 ${isDark ? 'bg-gray-800/50' : 'bg-white shadow-md'}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className={`mb-6 ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
          Your payment of ${amount.toFixed(2)} has been processed successfully.
        </p>
        
        <div className={`w-full p-4 rounded-lg mb-6 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex justify-between mb-2">
            <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Payment ID</span>
            <span className="font-mono">{paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Booking ID</span>
            <span className="font-mono">{bookingId}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            href={`/bookings/${bookingId}`}
            className={`flex-1 py-2 px-4 rounded-lg text-center ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            View Booking
          </Link>
          
          <Link
            href="/bookings"
            className={`flex-1 py-2 px-4 rounded-lg text-center ${
              isDark 
                ? 'bg-primary hover:opacity-90 text-white' 
                : 'bg-primary hover:opacity-90 text-white'
            }`}
          >
            My Bookings
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 