'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { bookingService } from '@/lib/api';

interface Flight {
  id: string;
  flight_number: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  airline: string;
  aircraft?: string;
  terminal?: string;
  gate?: string;
  status?: string;
}

export default function FlightDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  const flightId = params.id as string;
  
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    const fetchFlightDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, we would fetch from API
        // const response = await flightService.getFlightById(flightId);
        // setFlight(response.data);
        
        // For demo, create a mock flight
        setFlight(generateMockFlight(flightId));
      } catch (err: any) {
        setError('Failed to fetch flight details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlightDetails();
  }, [flightId]);
  
  // Function to generate a mock flight for demo
  const generateMockFlight = (id: string): Flight => {
    const cities = ['NYC', 'LAX', 'CHI', 'MIA', 'SFO', 'DFW', 'SEA', 'BOS'];
    const airlines = ['Cosmic Airways', 'Stellar Airlines', 'Quantum Jets', 'Nebula Air'];
    const aircraft = ['Boeing 787-9', 'Airbus A350-900', 'Quantum X-1000', 'Stellar Cruiser'];
    
    const fromCity = cities[Math.floor(Math.random() * cities.length)];
    const toCity = cities.filter(c => c !== fromCity)[Math.floor(Math.random() * (cities.length - 1))];
    
    const departureHour = 6 + Math.floor(Math.random() * 12);
    const flightDuration = 2 + Math.floor(Math.random() * 6);
    const departureTime = `2024-06-15T${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`;
    const arrivalTime = new Date(new Date(departureTime).getTime() + flightDuration * 60 * 60 * 1000).toISOString();
    
    return {
      id,
      flight_number: `CS${id.slice(-3)}`,
      origin: fromCity,
      destination: toCity,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      price: 100 + Math.floor(Math.random() * 900),
      available_seats: 5 + Math.floor(Math.random() * 50),
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      aircraft: aircraft[Math.floor(Math.random() * aircraft.length)],
      terminal: String.fromCharCode(65 + Math.floor(Math.random() * 6)),
      gate: `${Math.floor(Math.random() * 30) + 1}`,
      status: 'On Time'
    };
  };
  
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
  };
  
  const calculateDuration = (departure: string, arrival: string) => {
    const durationMs = new Date(arrival).getTime() - new Date(departure).getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  
  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push(`/signin?redirect=/flights/${flightId}`);
      return;
    }
    
    setBookingLoading(true);
    setBookingError(null);
    
    try {
      // Create the booking with the API
      const bookingData = {
        flight_id: flightId,
        number_of_seats: numberOfSeats,
        payment_method: "credit_card" // You can make this dynamic later
      };
      
      const response = await bookingService.createBooking(bookingData);
      
      // Redirect to the booking details page
      router.push(`/bookings/${response.data.id}`);
    } catch (err: any) {
      console.error('Booking error:', err);
      setBookingError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !flight) {
    return (
      <div className="glass-effect rounded-xl p-8 text-center my-12">
        <h3 className="text-xl font-bold mb-2">Flight Not Found</h3>
        <p className="text-white/70 mb-4">{error || 'The requested flight could not be found'}</p>
        <Link 
          href="/flights"
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg inline-block"
        >
          Back to Flights
        </Link>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <Link 
        href="/flights" 
        className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Flights
      </Link>
      
      <motion.div 
        className="glass-effect rounded-xl overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="text-sm text-white/60 mb-1">{flight.airline}</div>
              <div className="text-3xl font-bold futuristic-text">{flight.flight_number}</div>
              {flight.aircraft && (
                <div className="text-sm text-white/60 mt-1">{flight.aircraft}</div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-sm text-white/60">Status</div>
              <div className="text-lg font-bold text-green-400">{flight.status || 'On Time'}</div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold futuristic-text glow">{formatTime(flight.departure_time)}</div>
              <div className="text-xl font-medium mt-1">{flight.origin}</div>
              <div className="text-sm text-white/60 mt-1">{formatDate(flight.departure_time)}</div>
              {flight.terminal && flight.gate && (
                <div className="text-sm text-white/60 mt-2">
                  Terminal {flight.terminal}, Gate {flight.gate}
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-sm font-medium text-white/80 mb-2">
                {calculateDuration(flight.departure_time, flight.arrival_time)}
              </div>
              <div className="relative w-32 md:w-64 h-0.5 bg-white/20 my-2">
                <div className="absolute top-1/2 right-0 w-3 h-3 rounded-full bg-primary transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 w-3 h-3 rounded-full bg-primary transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white/40 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="text-xs text-white/40 mt-2">Direct Flight</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold futuristic-text glow">{formatTime(flight.arrival_time)}</div>
              <div className="text-xl font-medium mt-1">{flight.destination}</div>
              <div className="text-sm text-white/60 mt-1">{formatDate(flight.arrival_time)}</div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-white/10">
            <div>
              <div className="text-sm text-white/60 mb-1">Price per passenger</div>
              <div className="text-3xl font-bold text-primary">${flight.price}</div>
              <div className="text-sm text-white/60 mt-1">{flight.available_seats} seats available</div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-auto">
                <label htmlFor="seats" className="block text-sm text-white/80 mb-1">
                  Number of Seats
                </label>
                <select
                  id="seats"
                  value={numberOfSeats}
                  onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {Array.from({ length: Math.min(6, flight.available_seats) }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} Seat{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg font-medium transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Book Now - $${flight.price * numberOfSeats}`
                )}
              </button>
            </div>
          </div>
          
          {bookingError && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
              {bookingError}
            </div>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        className="glass-effect rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-4 futuristic-text">Flight Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Amenities</h3>
            <ul className="space-y-2">
              {['Wi-Fi', 'In-flight Entertainment', 'Power Outlets', 'Meal Service', 'Extra Legroom'].map((amenity, index) => (
                <li key={index} className="flex items-center text-white/80">
                  <svg className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Baggage Information</h3>
            <div className="space-y-3 text-white/80">
              <p>Carry-on: 1 bag (max 8kg)</p>
              <p>Checked baggage: 1 bag (max 23kg)</p>
              <p>Additional baggage fees may apply</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 