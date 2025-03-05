'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    passengers: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string
    const queryString = new URLSearchParams({
      origin: searchParams.origin,
      destination: searchParams.destination,
      departure_date: searchParams.departure_date,
      available_seats: searchParams.passengers.toString()
    }).toString();
    
    router.push(`/flights?${queryString}`);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      <section className="py-20 flex flex-col items-center text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 futuristic-text glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          JOURNEY BEYOND THE HORIZON
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-white/80 max-w-2xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Experience the future of flight booking with our cutting-edge platform.
          Seamless journeys await at the speed of light.
        </motion.p>
        
        <motion.div 
          className="w-full max-w-4xl glass-effect rounded-2xl p-6 md:p-8 neon-border"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl md:text-2xl mb-6 futuristic-text">FIND YOUR FLIGHT</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="origin" className="block text-sm text-white/80">
                  Origin
                </label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  placeholder="Enter city or airport code"
                  value={searchParams.origin}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="destination" className="block text-sm text-white/80">
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  placeholder="Enter city or airport code"
                  value={searchParams.destination}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="departure_date" className="block text-sm text-white/80">
                  Departure Date
                </label>
                <input
                  type="date"
                  id="departure_date"
                  name="departure_date"
                  value={searchParams.departure_date}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="passengers" className="block text-sm text-white/80">
                  Passengers
                </label>
                <select
                  id="passengers"
                  name="passengers"
                  value={searchParams.passengers}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-4 rounded-lg font-medium transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              SEARCH FLIGHTS
            </button>
          </form>
        </motion.div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center futuristic-text glow-purple">
            WHY CHOOSE COSMIC FLIGHTS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quantum Speed Booking",
                description: "Our advanced AI processes your booking at light speed, ensuring instant confirmation.",
                icon: "⚡"
              },
              {
                title: "Holographic Flight Tracking",
                description: "Track your flight in real-time with our cutting-edge status monitoring system.",
                icon: "🔮"
              },
              {
                title: "Stellar Customer Service",
                description: "Our support team is available 24/7 across all dimensions of space and time.",
                icon: "✨"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-effect p-6 rounded-xl hover-scale"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 futuristic-text">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
