'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PassengerSelector from '@/components/PassengerSelector';
import { useTheme } from '@/contexts/ThemeContext';
import { bookingService, flightService } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface FlightDetailsProps {
  params: {
    id: string;
  };
}

interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  total_seats: number;
  available_seats: number;
  status: string;
  created_at: string;
  updated_at: string;
  aircraft?: string;
  terminal?: string;
  gate?: string;
}

export default function FlightDetailsPage({ params }: FlightDetailsProps) {
  const { id } = params;
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { isAuthenticated, user } = useAuthStore();
  
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    async function fetchFlightDetails() {
      try {
        const data = await flightService.getFlightById(id);
        console.log('Flight data:', data);
        setFlight(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load flight details');
      } finally {
        setLoading(false);
      }
    }
    
    fetchFlightDetails();
  }, [id]);
  
  const handleBookFlight = async () => {
    setIsProcessing(true);
    
    try {
      if (!flight) {
        throw new Error('Flight details not available');
      }
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        // Store booking intent in localStorage to resume after login
        localStorage.setItem('bookingIntent', JSON.stringify({
          flightId: flight.id,
          passengers: passengers
        }));
        
        // Show a modal or dialog to let the user choose between signin and signup
        // For simplicity, we'll just redirect to signin with a return URL
        router.push(`/signin?returnUrl=/flights/${flight.id}`);
        // Alternatively, you could add a link to signup in the UI
        // or redirect directly to signup with:
        // router.push(`/signup?returnUrl=/flights/${flight.id}`);
        return;
      }
      
      // User is authenticated, proceed with booking
      const bookingData = {
        flight_id: flight.id,
        number_of_seats: passengers,
        payment_method: "credit_card"
      };
      
      // Create the booking
      const response = await bookingService.createBooking(bookingData);
      const booking = response.data;
      
      // Redirect to the booking page where payment can be completed
      router.push(`/bookings/${booking.id}`);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/50' : 'bg-red-100'} text-center`}>
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className={isDark ? 'text-white/80' : 'text-red-700'}>
            {error || 'Flight not found'}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const departureDate = new Date(flight.departure_time);
  const arrivalDate = new Date(flight.arrival_time);
  
  // Calculate flight duration
  const durationMs = arrivalDate.getTime() - departureDate.getTime();
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const totalPrice = flight.price * passengers;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className={`flex items-center mb-6 ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Results
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-lg overflow-hidden ${
          isDark ? 'glass-effect' : 'bg-white shadow-lg border border-gray-200'
        }`}
      >
        <div className={`px-6 py-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{flight.airline} Flight {flight.flight_number}</h1>
              <p className={isDark ? 'text-white/70' : 'text-gray-600'}>
                {format(departureDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                flight.status === 'On Time' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {flight.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center mb-8">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="text-center mr-4">
                  <div className="text-3xl font-bold">{flight.origin}</div>
                  <div className={isDark ? 'text-white/70' : 'text-gray-600'}>
                    {format(departureDate, 'h:mm a')}
                  </div>
                </div>
                
                <div className="flex-1 px-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className={`px-2 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                        <div className="flex flex-col items-center">
                          <span className={`text-xs ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                            {durationHours}h {durationMinutes}m
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 00-.725-.962l-5-1.429a1 1 0 01.725-1.962l5 1.429a1 1 0 00.725-.038l5-1.429a1 1 0 011.444.962l-7 14z" />
                          </svg>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center ml-4">
                  <div className="text-3xl font-bold">{flight.destination}</div>
                  <div className={isDark ? 'text-white/70' : 'text-gray-600'}>
                    {format(arrivalDate, 'h:mm a')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Flight Details</h2>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Airline</p>
                    <p className="font-medium">{flight.airline}</p>
                  </div>
                  
                  <div>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Flight Number</p>
                    <p className="font-medium">{flight.flight_number}</p>
                  </div>
                  
                  <div>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Status</p>
                    <p className="font-medium capitalize">{flight.status}</p>
                  </div>
                  
                  <div>
                    <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Duration</p>
                    <p className="font-medium">{durationHours}h {durationMinutes}m</p>
                  </div>
                  
                  {flight.aircraft && (
                    <div>
                      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Aircraft</p>
                      <p className="font-medium">{flight.aircraft}</p>
                    </div>
                  )}
                  
                  {flight.terminal && (
                    <div>
                      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Terminal</p>
                      <p className="font-medium">{flight.terminal}</p>
                    </div>
                  )}
                  
                  {flight.gate && (
                    <div>
                      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Gate</p>
                      <p className="font-medium">{flight.gate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="mb-4">
                  <PassengerSelector
                    label="Passengers"
                    value={passengers}
                    onChange={setPassengers}
                    min={1}
                    max={flight.available_seats}
                    darkMode={isDark}
                  />
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Price per passenger</span>
                    <span className="font-medium">${flight.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleBookFlight}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium ${
                    isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Important Information</h2>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-white/70' : 'text-gray-600'}>
                    Please arrive at the airport at least 2 hours before departure for domestic flights and 3 hours for international flights.
                  </span>
                </li>
                
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-white/70' : 'text-gray-600'}>
                    Each passenger is allowed one carry-on bag and one personal item. Additional baggage fees may apply.
                  </span>
                </li>
                
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className={isDark ? 'text-white/70' : 'text-gray-600'}>
                    Valid identification is required for all passengers. International flights require a passport valid for at least 6 months beyond your return date.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 