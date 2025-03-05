'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin?redirect=/bookings');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        const data = await bookingService.getUserBookings();
        setBookings(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

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

  // Add this function after the getStatusColor function
  const calculateFlightDuration = (departureTime: string, arrivalTime: string) => {
    try {
      const departure = new Date(departureTime);
      const arrival = new Date(arrivalTime);
      const durationMs = arrival.getTime() - departure.getTime();
      
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    } catch (error) {
      return 'Duration unavailable';
    }
  };

  // Handle booking cancellation
  const openCancelModal = (id: string) => {
    setBookingToCancel(id);
    setCancelModalOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      setIsCancelling(true);
      await bookingService.cancelBooking(bookingToCancel);
      
      // Update the booking status in the UI
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingToCancel 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      
      // Close the modal
      setCancelModalOpen(false);
      setBookingToCancel(null);
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

  return (
    <>
      <div className="max-w-6xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 futuristic-text">MY BOOKINGS</h1>

          {error && (
            <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {bookings.length === 0 && !isLoading && !error ? (
            <div className="glass-effect rounded-xl p-8 text-center">
              <h2 className="text-xl mb-4">No bookings found</h2>
              <p className="text-white/60 mb-6">You haven't made any flight bookings yet.</p>
              <button
                onClick={() => router.push('/flights')}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition-all"
              >
                Book a Flight
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  className="glass-effect rounded-xl p-6 neon-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold mr-2">
                          {booking.flight.airline.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold">
                          {booking.flight.origin} → {booking.flight.destination}
                        </h2>
                      </div>
                      <p className="text-white/60">
                        Booking Reference: <span className="font-mono">{booking.booking_reference}</span>
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                        {booking.status ? 
                          (booking.status.toString().charAt(0).toUpperCase() + booking.status.toString().slice(1)) 
                          : 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <h3 className="text-sm text-white/60 mb-1">Flight Details</h3>
                      <p className="font-medium">{booking.flight.airline} • {booking.flight.flight_number}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex-1">
                          <p className="text-lg font-bold">{booking.flight.origin}</p>
                          <p className="text-sm text-white/60">{formatDate(booking.flight.departure_time)}</p>
                        </div>
                        <div className="px-4">
                          <div className="w-16 h-px bg-white/20 relative">
                            <div className="absolute -top-2 right-0">✈️</div>
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-white/60">
                              {calculateFlightDuration(booking.flight.departure_time, booking.flight.arrival_time)}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold">{booking.flight.destination}</p>
                          <p className="text-sm text-white/60">{formatDate(booking.flight.arrival_time)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm text-white/60 mb-1">Booking Details</h3>
                      <p>Seats: {booking.number_of_seats}</p>
                      <p>Total: ${booking.total_amount.toFixed(2)}</p>
                      <p className="text-sm text-white/60 mt-1">Booked on {formatDate(booking.created_at)}</p>
                    </div>

                    <div>
                      <h3 className="text-sm text-white/60 mb-1">Flight Status</h3>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          booking.flight.status === 'scheduled' ? 'bg-green-400' :
                          booking.flight.status === 'delayed' ? 'bg-yellow-400' :
                          booking.flight.status === 'cancelled' ? 'bg-red-400' :
                          'bg-blue-400'
                        }`}></div>
                        <p className="capitalize">{booking.flight.status}</p>
                      </div>
                      {booking.flight.status === 'scheduled' && (
                        <p className="text-sm text-white/60 mt-1">
                          {booking.flight.available_seats} seats available
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                    >
                      View Details
                    </button>
                    
                    {booking.status && booking.status.toString().toLowerCase() !== 'cancelled' && (
                      <button
                        onClick={() => openCancelModal(booking.id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
          
          {bookingToCancel && (
            <div className="bg-white/5 p-3 rounded-lg">
              <p className="text-sm text-white/60">Booking Reference:</p>
              <p className="font-mono">
                {bookings.find(b => b.id === bookingToCancel)?.booking_reference || bookingToCancel}
              </p>
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