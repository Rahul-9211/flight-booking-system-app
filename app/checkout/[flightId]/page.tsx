'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from '@/components/PaymentForm';
import { useTheme } from '@/contexts/ThemeContext';

interface CheckoutPageProps {
  params: {
    flightId: string;
  };
  searchParams: {
    passengers?: string;
  };
}

export default function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { flightId } = params;
  const passengers = parseInt(searchParams.passengers || '1');
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchFlightDetails() {
      try {
        const response = await fetch(`/api/flights/${flightId}`);
        
        if (!response.ok) {
          throw new Error('Flight not found');
        }
        
        const data = await response.json();
        setFlight(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load flight details');
      } finally {
        setLoading(false);
      }
    }
    
    fetchFlightDetails();
  }, [flightId]);
  
  const handlePaymentSuccess = (paymentIntentId: string) => {
    router.push(`/booking-confirmation/${paymentIntentId}`);
  };
  
  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
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
  
  const totalAmount = flight.price * passengers;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className={`rounded-lg p-6 mb-6 ${
            isDark ? 'glass-effect' : 'bg-white shadow-md border border-gray-200'
          }`}>
            <PaymentForm
              amount={totalAmount}
              flightId={flightId}
              passengers={passengers}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
        
        <div>
          <div className={`rounded-lg p-6 sticky top-24 ${
            isDark ? 'glass-effect' : 'bg-white shadow-md border border-gray-200'
          }`}>
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Flight</span>
                <span className="font-medium">{flight.airline} {flight.flight_number}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Route</span>
                <span className="font-medium">{flight.origin} → {flight.destination}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Date</span>
                <span className="font-medium">
                  {new Date(flight.departure_time).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Time</span>
                <span className="font-medium">
                  {new Date(flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Passengers</span>
                <span className="font-medium">{passengers}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className={isDark ? 'text-white/70' : 'text-gray-600'}>Price per passenger</span>
                <span className="font-medium">${flight.price.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-sm text-center mt-6">
              <p className={isDark ? 'text-white/50' : 'text-gray-500'}>
                Your payment is processed securely through Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 