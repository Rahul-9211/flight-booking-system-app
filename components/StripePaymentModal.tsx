'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import Modal from './Modal';

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export default function StripePaymentModal({ isOpen, onClose, onSuccess, amount }: StripePaymentModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Payment">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" />
              <path d="M4 6h16v2H4z" />
              <path d="M4 10h4v2H4z" />
              <path d="M4 14h4v2H4z" />
              <path d="M10 10h10v6H10z" />
            </svg>
            <span className="ml-2 font-semibold">Secure Payment</span>
          </div>
          <div className="text-right">
            <p className="font-bold">${amount.toFixed(2)}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm ${isDark ? 'text-white/70' : 'text-gray-600'} mb-1`}>
                Card Number
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className={`w-full p-2 rounded-md ${
                  isDark 
                    ? 'bg-gray-800 border border-gray-700 text-white' 
                    : 'bg-white border border-gray-300 text-gray-800'
                }`}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm ${isDark ? 'text-white/70' : 'text-gray-600'} mb-1`}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className={`w-full p-2 rounded-md ${
                    isDark 
                      ? 'bg-gray-800 border border-gray-700 text-white' 
                      : 'bg-white border border-gray-300 text-gray-800'
                  }`}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm ${isDark ? 'text-white/70' : 'text-gray-600'} mb-1`}>
                  CVC
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className={`w-full p-2 rounded-md ${
                    isDark 
                      ? 'bg-gray-800 border border-gray-700 text-white' 
                      : 'bg-white border border-gray-300 text-gray-800'
                  }`}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm ${isDark ? 'text-white/70' : 'text-gray-600'} mb-1`}>
                Name on Card
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full p-2 rounded-md ${
                  isDark 
                    ? 'bg-gray-800 border border-gray-700 text-white' 
                    : 'bg-white border border-gray-300 text-gray-800'
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 mr-2 rounded-md ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                disabled={isProcessing}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className={`px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white flex items-center ${
                  isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
} 