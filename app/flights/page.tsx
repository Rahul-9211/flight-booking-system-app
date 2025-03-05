'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { flightService } from '@/lib/api';
import { format } from 'date-fns';

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
}

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get search params from URL
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departure_date = searchParams.get('departure_date') || '';
  const available_seats = searchParams.get('available_seats') || '';
  
  // Additional filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>('price');
  
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query params
        const params: Record<string, string> = {};
        if (origin) params.origin = origin;
        if (destination) params.destination = destination;
        if (departure_date) params.departure_date = departure_date;
        if (available_seats) params.available_seats = available_seats;
        
        // Add price range if set
        if (priceRange[0] > 0) params.min_price = priceRange[0].toString();
        if (priceRange[1] < 2000) params.max_price = priceRange[1].toString();
        
        const response = await flightService.searchFlights(params);
        
        // Sort flights
        let sortedFlights = [...response.data];
        if (sortBy === 'price') {
          sortedFlights.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'departure') {
          sortedFlights.sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());
        } else if (sortBy === 'duration') {
          sortedFlights.sort((a, b) => {
            const durationA = new Date(a.arrival_time).getTime() - new Date(a.departure_time).getTime();
            const durationB = new Date(b.arrival_time).getTime() - new Date(b.departure_time).getTime();
            return durationA - durationB;
          });
        }
        
        setFlights(sortedFlights);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch flights');
        // For demo purposes, let's add some mock data
        setFlights(generateMockFlights());
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlights();
  }, [origin, destination, departure_date, available_seats, priceRange, sortBy]);
  
  // Function to generate mock flights for demo
  const generateMockFlights = (): Flight[] => {
    const mockFlights: Flight[] = [];
    const cities = ['NYC', 'LAX', 'CHI', 'MIA', 'SFO', 'DFW', 'SEA', 'BOS'];
    const airlines = ['Cosmic Airways', 'Stellar Airlines', 'Quantum Jets', 'Nebula Air'];
    
    // Use search params if available
    const fromCity = origin || cities[Math.floor(Math.random() * cities.length)];
    const toCity = destination || cities.filter(c => c !== fromCity)[Math.floor(Math.random() * (cities.length - 1))];
    const date = departure_date || '2024-06-15';
    
    for (let i = 0; i < 10; i++) {
      const departureHour = 6 + Math.floor(Math.random() * 12);
      const flightDuration = 2 + Math.floor(Math.random() * 6);
      const departureTime = `${date}T${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`;
      const arrivalTime = new Date(new Date(departureTime).getTime() + flightDuration * 60 * 60 * 1000).toISOString();
      
      mockFlights.push({
        id: `FL-${1000 + i}`,
        flight_number: `CS${100 + i}`,
        origin: fromCity,
        destination: toCity,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        price: 100 + Math.floor(Math.random() * 900),
        available_seats: 5 + Math.floor(Math.random() * 50),
        airline: airlines[Math.floor(Math.random() * airlines.length)]
      });
    }
    
    return mockFlights;
  };
  
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const calculateDuration = (departure: string, arrival: string) => {
    const durationMs = new Date(arrival).getTime() - new Date(departure).getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="py-8">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-8 futuristic-text text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AVAILABLE FLIGHTS
      </motion.h1>
      
      {/* Search filters */}
      <motion.div 
        className="glass-effect rounded-xl p-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="text-white/80">
              <span className="font-bold">{origin || 'Any'}</span> → <span className="font-bold">{destination || 'Any'}</span>
            </div>
            <div className="text-white/60 text-sm">
              {departure_date ? formatDate(departure_date) : 'Any date'}
            </div>
            {available_seats && (
              <div className="text-white/60 text-sm">
                {available_seats} passenger{parseInt(available_seats) > 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm text-white/80">Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="price">Price</option>
                <option value="departure">Departure Time</option>
                <option value="duration">Duration</option>
              </select>
            </div>
            
            <Link 
              href="/"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              New Search
            </Link>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-white/80">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>
      </motion.div>
      
      {/* Flight results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="glass-effect rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <p className="mt-2 text-white/70">Showing demo flights instead</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="glass-effect rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">No Flights Found</h3>
          <p className="text-white/70 mb-4">Try adjusting your search criteria</p>
          <Link 
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg inline-block"
          >
            New Search
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {flights.map((flight, index) => (
            <motion.div
              key={flight.id}
              className="glass-effect rounded-xl overflow-hidden hover-scale"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <div className="text-sm text-white/60 mb-1">{flight.airline}</div>
                    <div className="text-lg font-bold">{flight.flight_number}</div>
                  </div>
                  
                  <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold futuristic-text">{formatTime(flight.departure_time)}</div>
                      <div className="text-sm text-white/60">{flight.origin}</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-white/60">{calculateDuration(flight.departure_time, flight.arrival_time)}</div>
                      <div className="relative w-32 md:w-48 h-0.5 bg-white/20 my-2">
                        <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-primary transform -translate-y-1/2"></div>
                        <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-primary transform -translate-y-1/2"></div>
                      </div>
                      <div className="text-xs text-white/40">{formatDate(flight.departure_time)}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold futuristic-text">{formatTime(flight.arrival_time)}</div>
                      <div className="text-sm text-white/60">{flight.destination}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${flight.price}</div>
                    <div className="text-sm text-white/60">{flight.available_seats} seats left</div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Link 
                    href={`/flights/${flight.id}`}
                    className="px-6 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-white/10 rounded-full transition-all"
                  >
                    Select Flight
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 