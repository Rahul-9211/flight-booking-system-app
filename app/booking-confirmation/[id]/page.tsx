'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import PaymentConfirmation from '@/components/PaymentConfirmation';
import { bookingService, paymentApi } from '@/lib/api';

interface BookingConfirmationProps {
  params: {
    id: string;
  };
}

export default function BookingConfirmationPage({ params }: BookingConfirmationProps) {
  const { id } = params;
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [booking, setBooking] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch booking details
        const bookingData = await bookingService.getBookingById(id);
        setBooking(bookingData);
        
        // Fetch payment details
        const paymentData = await paymentApi.getPaymentByBookingId(id);
        setPayment(paymentData);
      } catch (err: any) {
        setError(err.message || 'Failed to load confirmation details');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`p-6 rounded-lg ${isDark ? 'bg-red-900/20' : 'bg-red-50'} text-center`}>
          <h2 className="text-xl font-bold mb-2 text-red-500">Error</h2>
          <p className={isDark ? 'text-white/80' : 'text-red-700'}>{error}</p>
          <button
            onClick={() => router.push('/bookings')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Booking Confirmation</h1>
        
        {payment && booking && (
          <div className="max-w-2xl mx-auto">
            <PaymentConfirmation 
              paymentId={payment.id} 
              amount={payment.amount} 
              bookingId={booking.id} 
            />
          </div>
        )}
      </motion.div>
    </div>
  );
} 