'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { bookingService } from '@/lib/api';
import Modal from '@/components/Modal';

interface Flight {
  id: string;
  price: number;
  origin: string;
  status: string;
  airline: string;
  destination: string;
  total_seats: number;
  arrival_time: string;
  flight_number: string;
  departure_time: string;
  available_seats: number;
}

interface Booking {
  id: string;
  user_id: string;
  flight_id: string;
  booking_reference: string;
  number_of_seats: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  flight: Flight;
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/signin?redirect=/bookings/${bookingId}`);
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

  // Get status badge color
  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return 'bg-gray-500/20 text-gray-400';
    
    switch (status.toString().toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  // Handle booking cancellation
  const openCancelModal = () => {
    setCancelModalOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    
    try {
      setIsCancelling(true);
      await bookingService.cancelBooking(booking.id);
      
      // Update the booking status in the UI
      setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
      
      // Close the modal
      setCancelModalOpen(false);
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      alert(err.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
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
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="p-6 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => router.push('/bookings')}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="glass-effect rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-white/60 mb-4">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => router.push('/bookings')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <button
            onClick={() => router.push('/bookings')}
            className="flex items-center text-white/60 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Bookings
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-effect rounded-xl p-8 neon-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1 futuristic-text">BOOKING DETAILS</h1>
              <p className="text-white/60">
                Reference: <span className="font-mono">{booking.booking_reference}</span>
              </p>
            </div>
            <span className={`mt-2 md:mt-0 inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
              {booking.status ? 
                (booking.status.toString().charAt(0).toUpperCase() + booking.status.toString().slice(1)) 
                : 'Unknown'}
            </span>
          </div>

          <div className="mb-8">
            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Flight Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-white/60 mb-2">Flight</h3>
                  <p className="font-medium">{booking.flight.airline} • {booking.flight.flight_number}</p>
                  <p className="text-sm text-white/60 mt-1">Status: <span className="capitalize">{booking.flight.status}</span></p>
                </div>
                <div>
                  <h3 className="text-sm text-white/60 mb-2">Price</h3>
                  <p className="font-medium">${booking.flight.price.toFixed(2)} per seat</p>
                  <p className="text-sm text-white/60 mt-1">{booking.flight.available_seats} seats available</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-sm text-white/60 mb-1">Departure</h3>
                    <p className="text-2xl font-bold">{booking.flight.origin}</p>
                    <p className="text-sm text-white/60">{formatDate(booking.flight.departure_time)}</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-32 h-px bg-white/20 relative mt-8">
                      <div className="absolute -top-2 right-0">✈️</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-white/60 mb-1">Arrival</h3>
                    <p className="text-2xl font-bold">{booking.flight.destination}</p>
                    <p className="text-sm text-white/60">{formatDate(booking.flight.arrival_time)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Booking Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-white/60 mb-2">Booking Details</h3>
                  <p>Number of Seats: {booking.number_of_seats}</p>
                  <p>Total Amount: ${booking.total_amount.toFixed(2)}</p>
                  <p className="text-sm text-white/60 mt-2">Booked on {formatDate(booking.created_at)}</p>
                  {booking.updated_at !== booking.created_at && (
                    <p className="text-sm text-white/60">Last updated on {formatDate(booking.updated_at)}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm text-white/60 mb-2">Passenger Information</h3>
                  <p>Booking ID: {booking.id}</p>
                  <p>User ID: {booking.user_id}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {booking.status.toLowerCase() === 'pending' && (
              <button
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg transition-all"
              >
                Confirm Payment
              </button>
            )}
            
            {booking.status && booking.status.toString().toLowerCase() !== 'cancelled' && (
              <button
                onClick={openCancelModal}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Cancel Booking Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
          
          {booking && (
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm text-white/60">Booking Reference:</p>
              <p className="font-mono">{booking.booking_reference}</p>
              <p className="text-sm text-white/60 mt-2">Flight:</p>
              <p>{booking.flight.airline} • {booking.flight.flight_number}</p>
              <p className="text-sm mt-1">{booking.flight.origin} → {booking.flight.destination}</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
              disabled={isCancelling}
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancelBooking}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all flex items-center"
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cancelling...
                </>
              ) : (
                'Cancel Booking'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
} 