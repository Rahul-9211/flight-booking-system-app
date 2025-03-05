'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AirportSelector from '@/components/AirportSelector';
import DatePicker from '@/components/DatePicker';
import { format } from 'date-fns';
import PassengerSelector from '@/components/PassengerSelector';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [searchError, setSearchError] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      setSearchError('Please select both origin and destination');
      return;
    }
    
    if (!departureDate) {
      setSearchError('Please select a departure date');
      return;
    }
    
    // Clear any previous errors
    setSearchError('');
    
    // Build the search query
    const searchParams = new URLSearchParams();
    searchParams.append('origin', origin);
    searchParams.append('destination', destination);
    searchParams.append('departure_date', format(departureDate, 'yyyy-MM-dd'));
    searchParams.append('available_seats', passengers.toString());
    
    // Navigate to the flights page with search parameters
    router.push(`/flights?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Alert Bar */}
      {showAlert && (
        <div className="bg-gradient-to-r from-primary/80 to-secondary/80 text-white py-3 px-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm md:text-base">
                Try searching for flights from MIA to CUN with 2 passengers on March 31, 2025 for best results!
              </p>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-4 text-white/80 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="relative flex-1 flex items-center justify-center py-20">
        {/* Background with parallax effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-black/40 to-black/80' : 'bg-gradient-to-b from-white/40 to-white/80'} z-10`}></div>
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center"
          ></motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 futuristic-text">
              EXPLORE THE COSMOS
            </h1>
            <p className={`text-xl md:text-2xl ${isDark ? 'text-white/80' : 'text-gray-800'} max-w-3xl mx-auto`}>
              Book your next adventure with the most advanced flight booking platform
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className={`${isDark ? 'glass-effect' : 'bg-white shadow-lg border border-gray-200'} rounded-2xl p-6 md:p-8`}>
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <AirportSelector
                    label="From"
                    value={origin}
                    onChange={setOrigin}
                    placeholder="Select origin"
                    excludeCode={destination}
                    darkMode={isDark}
                  />
                  
                  <AirportSelector
                    label="To"
                    value={destination}
                    onChange={setDestination}
                    placeholder="Select destination"
                    excludeCode={origin}
                    darkMode={isDark}
                  />
                  
                  <div>
                    <DatePicker
                      label="Departure Date"
                      selectedDate={departureDate}
                      onChange={setDepartureDate}
                      minDate={new Date()}
                      placeholder="Select departure date"
                      darkMode={isDark}
                    />
                  </div>
                  
                  <div>
                    <PassengerSelector
                      label="Passengers"
                      value={passengers}
                      onChange={setPassengers}
                      min={1}
                      max={6}
                      darkMode={isDark}
                    />
                  </div>
                </div>
                
                {searchError && (
                  <div className="text-red-400 mb-4 text-center">
                    {searchError}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-lg font-medium hover:opacity-90 transition-opacity text-white"
                >
                  Search Flights
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className={isDark ? 'bg-black/60' : 'bg-gray-100'}>
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Cosmic Flights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className={isDark ? 'glass-effect rounded-xl p-6 text-center' : 'bg-white shadow-md rounded-xl p-6 text-center border border-gray-200'}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className={isDark ? 'text-white/70' : 'text-gray-600'}>Book your flights in seconds with our streamlined booking process.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className={isDark ? 'glass-effect rounded-xl p-6 text-center' : 'bg-white shadow-md rounded-xl p-6 text-center border border-gray-200'}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
              <p className={isDark ? 'text-white/70' : 'text-gray-600'}>Your payment and personal information are always protected.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className={isDark ? 'glass-effect rounded-xl p-6 text-center' : 'bg-white shadow-md rounded-xl p-6 text-center border border-gray-200'}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className={isDark ? 'text-white/70' : 'text-gray-600'}>We guarantee the best prices for your travel needs.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
