'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { useTheme } from '@/contexts/ThemeContext';

interface PaymentFormProps {
  amount: number;
  flightId: string;
  passengers: number;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

function PaymentFormContent({ 
  amount, 
  flightId, 
  passengers, 
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    if (!cardComplete) {
      setPaymentError('Please complete your card details');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create a payment intent on the server
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          flightId,
          passengers,
          currency: 'usd',
          receipt_email: billingDetails.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment successful
        if (onSuccess) {
          onSuccess(paymentIntent.id);
        } else {
          // Navigate to success page
          router.push(`/booking-confirmation/${paymentIntent.id}`);
        }
      }
    } catch (error: any) {
      setPaymentError(error.message || 'An error occurred during payment processing');
      if (onError) {
        onError(error.message || 'An error occurred during payment processing');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={billingDetails.name}
              onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
              required
              className={`w-full px-3 py-2 rounded-md ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={billingDetails.email}
              onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
              required
              className={`w-full px-3 py-2 rounded-md ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="john.doe@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={billingDetails.phone}
              onChange={(e) => setBillingDetails({ ...billingDetails, phone: e.target.value })}
              className={`w-full px-3 py-2 rounded-md ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={billingDetails.address.line1}
              onChange={(e) => setBillingDetails({ 
                ...billingDetails, 
                address: { ...billingDetails.address, line1: e.target.value } 
              })}
              required
              className={`w-full px-3 py-2 rounded-md ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="123 Main St"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={billingDetails.address.city}
              onChange={(e) => setBillingDetails({ 
                ...billingDetails, 
                address: { ...billingDetails.address, city: e.target.value } 
              })}
              required
              className={`w-full px-3 py-2 rounded-md ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="New York"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              value={billingDetails.address.state}
              onChange={(e) => setBillingDetails({ 
                ...billingDetails, 
                address: { ...billingDetails.address, state: e.target.value } 
              })}
              required
              className={`w-full px-3 py-2 rounded-md ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="NY"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code</label>
            <input
              type="text"
              value={billingDetails.address.postal_code}
              onChange={(e) => setBillingDetails({ 
                ...billingDetails, 
                address: { ...billingDetails.address, postal_code: e.target.value } 
              })}
              required
              className={`w-full px-3 py-2 rounded-md ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700 text-white' 
                  : 'bg-white border border-gray-300 text-gray-800'
              }`}
              placeholder="10001"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        
        <div className={`p-4 rounded-md mb-4 ${
          isDark 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-300'
        }`}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: isDark ? '#ffffff' : '#32325d',
                  '::placeholder': {
                    color: isDark ? '#aab7c4' : '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a',
                },
              },
            }}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>
        
        {paymentError && (
          <div className="text-red-500 mb-4">
            {paymentError}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">
            Total: ${amount.toFixed(2)}
          </div>
          
          <button
            type="submit"
            disabled={isProcessing || !stripe}
            className={`px-6 py-2 rounded-md bg-gradient-to-r from-primary to-secondary text-white font-medium ${
              isProcessing || !stripe ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={getStripe()}>
      <PaymentFormContent {...props} />
    </Elements>
  );
} 