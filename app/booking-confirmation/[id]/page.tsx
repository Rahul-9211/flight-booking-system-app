'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { bookingService } from '@/lib/api';
import Link from 'next/link';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/signin?redirect=/booking-confirmation/${bookingId}`);
    }
  }, [isAuthenticated, authLoading, router, bookingId]);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!isAuthenticated || !bookingId) return;
      
      try {
        setIsLoading(true);
        const data = await bookingService.getBookingById(bookingId);
        setBooking(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching booking details:', err);
        setError(err.message || 'Failed to load booking details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [isAuthenticated, bookingId]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="glass-effect rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Booking</h1>
          <p className="text-white/60 mb-6">{error || 'Booking not found'}</p>
          <Link href="/flights" className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition-all">
            Browse Flights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 futuristic-text">BOOKING CONFIRMED</h1>
        <p className="text-white/60 mb-8">Your flight has been booked successfully!</p>
        
        <div className="bg-white/5 rounded-lg p-6 mb-8 text-left">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{booking.flight.origin} → {booking.flight.destination}</h2>
              <p className="text-white/60">
                {booking.flight.airline} • Flight {booking.flight.flight_number}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/60">Booking Reference</p>
              <p className="font-mono text-lg">{booking.booking_reference}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-white/60 mb-1">Departure</p>
              <p className="font-bold">{formatDate(booking.flight.departure_time)}</p>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-1">Arrival</p>
              <p className="font-bold">{formatDate(booking.flight.arrival_time)}</p>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-1">Seats</p>
              <p className="font-bold">{booking.number_of_seats}</p>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-1">Total Amount</p>
              <p className="font-bold">${booking.total_amount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link href={`/bookings/${booking.id}`} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all">
            View Booking Details
          </Link>
          <Link href="/bookings" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all">
            View All Bookings
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 