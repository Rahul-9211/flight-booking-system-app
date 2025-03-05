'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, we would call the API
      // await authService.signin(formData);
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store a mock token
      localStorage.setItem('token', 'mock-jwt-token');
      
      // Redirect
      router.push(redirect);
    } catch (err: any) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div 
        className="glass-effect rounded-xl p-8 neon-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center futuristic-text">SIGN IN</h1>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center text-red-400">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-white/80">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-white/80">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 