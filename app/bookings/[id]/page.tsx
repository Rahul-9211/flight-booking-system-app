'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { bookingService, paymentApi } from '@/lib/api';
import Modal from '@/components/Modal';
import { useTheme } from '@/contexts/ThemeContext';
import StripePaymentModal from '@/components/StripePaymentModal';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [payment, setPayment] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);

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

        // Fetch payment details for this booking
        try {
          const paymentData = await paymentApi.getPaymentByBookingId(bookingId);
          setPayment(paymentData);
        } catch (paymentError) {
          console.error('Error fetching payment details:', paymentError);
          // We don't set an error here as the booking might not have a payment yet
        }
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

  // Add this function to calculate flight duration
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

  const handleConfirmPayment = () => {
    // Show the Stripe payment modal first
    setShowStripeModal(true);
  };

  const processPaymentAfterStripe = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Check if booking exists before accessing its properties
      if (!booking) {
        throw new Error('Booking details not found');
      }
      
      // If we don't have a payment yet, create one
      let paymentToProcess = payment;
      
      if (!paymentToProcess) {
        // Create a new payment using the API
        paymentToProcess = await paymentApi.createPayment({
          bookingId: booking.id,
          flightId: booking.flight.id,
          amount: booking.total_amount,
          passengers: booking.number_of_seats,
        });
        
        setPayment(paymentToProcess);
      }
      
      // Process the payment using the API
      const processedPayment = await paymentApi.processPayment(paymentToProcess.id, {
        paymentMethod: 'credit_card',
        cardBrand: 'Visa',
        last4: '4242',
      });
      
      // Update booking status to confirmed
      await bookingService.confirmBooking(booking.id);
      
      // Update local state
      setBooking(prev => prev ? { ...prev, status: 'confirmed' } : null);
      setPayment(processedPayment);
      setPaymentSuccess(true);
      
      // Redirect to confirmation page after a short delay
      setTimeout(() => {
        router.push(`/booking-confirmation/${booking.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Payment processing error:', err);
      setError(err.message || 'Failed to process payment');
    } finally {
      setIsProcessingPayment(false);
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

  const departureDate = new Date(booking.flight.departure_time);
  const arrivalDate = new Date(booking.flight.arrival_time);
  
  // Calculate flight duration
  const durationMs = arrivalDate.getTime() - departureDate.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const isPaid = payment && payment.status === 'completed';
  const isRefunded = payment && payment.status === 'refunded';
  
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
            className={`flex items-center text-white/60 hover:text-white transition-colors ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
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
          className={`glass-effect rounded-xl p-8 neon-border ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}
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
              
              {/* Flight header with airline and status */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold mr-3">
                    {booking.flight.airline.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{booking.flight.airline}</h3>
                    <p className="text-white/60">Flight {booking.flight.flight_number}</p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    booking.flight.status === 'scheduled' ? 'bg-green-500/20 text-green-400' :
                    booking.flight.status === 'delayed' ? 'bg-yellow-500/20 text-yellow-400' :
                    booking.flight.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    <span className="capitalize">{booking.flight.status}</span>
                  </div>
                </div>
              </div>
              
              {/* Flight route visualization */}
              <div className="mb-6">
                <div className="relative py-6">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10"></div>
                  
                  <div className="flex justify-between relative z-10">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                      </div>
                      <p className="font-bold text-xl">{booking.flight.origin}</p>
                      <p className="text-sm text-white/60">{formatDate(booking.flight.departure_time)}</p>
                    </div>
                    
                    <div className="text-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-white/60 mt-1">
                        {calculateFlightDuration(booking.flight.departure_time, booking.flight.arrival_time)}
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                      </div>
                      <p className="font-bold text-xl">{booking.flight.destination}</p>
                      <p className="text-sm text-white/60">{formatDate(booking.flight.arrival_time)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Flight details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm text-white/60 mb-2">Price</h3>
                  <p className="font-medium">${booking.flight.price.toFixed(2)} per seat</p>
                  <p className="text-sm text-white/60 mt-1">Total: ${booking.total_amount.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-white/60 mb-2">Seats</h3>
                  <p className="font-medium">{booking.number_of_seats} seat(s) booked</p>
                  <p className="text-sm text-white/60 mt-1">{booking.flight.available_seats} seats available</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-white/60 mb-2">Booking Status</h3>
                  <p className={`font-medium ${
                    booking.status === 'confirmed' ? 'text-green-400' :
                    booking.status === 'pending' ? 'text-yellow-400' :
                    booking.status === 'cancelled' ? 'text-red-400' :
                    'text-white'
                  }`}>
                    <span className="capitalize">{booking.status}</span>
                  </p>
                  <p className="text-sm text-white/60 mt-1">Ref: {booking.booking_reference}</p>
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
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment}
                className={`px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg transition-all ${
                  isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isProcessingPayment ? 'Processing...' : 'Confirm Payment'}
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

      {paymentSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-green-900/50' : 'bg-green-100'} text-center`}
        >
          <h2 className="text-xl font-bold mb-2 text-green-500">Payment Successful!</h2>
          <p className={isDark ? 'text-white/80' : 'text-green-700'}>
            Your payment has been processed successfully. Redirecting to confirmation page...
          </p>
        </motion.div>
      )}

      <StripePaymentModal
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        onSuccess={() => {
          setShowStripeModal(false);
          processPaymentAfterStripe();
        }}
        amount={booking?.total_amount || 0}
      />
    </>
  );
} 