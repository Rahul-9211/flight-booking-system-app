'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, loadUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  
  // Load user data on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await loadUser();
      } catch (error) {
        console.error('Error loading user in profile page:', error);
        router.push('/signin?redirect=/profile');
      }
    };
    
    checkAuth();
  }, [loadUser, router]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to signin');
      router.push('/signin?redirect=/profile');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || ''
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (formError) setFormError(null);
  };
  
  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setFormError('Full name is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // In a real app, you would update the user profile here
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the local user data
      if (user) {
        const updatedUser = {
          ...user,
          full_name: formData.full_name,
          phone_number: formData.phone_number
        };
        useAuthStore.setState({ user: updatedUser });
      }
      
      setIsEditing(false);
      setFormError(null);
    } catch (error: any) {
      setFormError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="max-w-4xl mx-auto py-12">
      <motion.div 
        className="glass-effect rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold futuristic-text">MY PROFILE</h1>
          
          <div className="flex gap-4">
            {!isEditing && (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-white/10 rounded-lg transition-all"
                >
                  Edit Profile
                </button>
                
                <button 
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
        
        {formError && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center text-red-400">
            {formError}
          </div>
        )}
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="full_name" className="block text-sm text-white/80">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isSaving}
              />
            </div>
            
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
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 opacity-70"
                disabled
              />
              <p className="text-xs text-white/60">Email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone_number" className="block text-sm text-white/80">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isSaving}
              />
            </div>
            
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                disabled={isSaving}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-lg transition-all"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-white/60 mb-1">Full Name</h3>
                  <p className="text-lg">{user.full_name || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-white/60 mb-1">Email</h3>
                  <p className="text-lg">{user.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-white/60 mb-1">Phone Number</h3>
                  <p className="text-lg">{user.phone_number || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-white/60 mb-1">Account ID</h3>
                  <p className="text-lg font-mono">{user.id}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-white/60 mb-1">Member Since</h3>
                  <p className="text-lg">{formatDate(user.created_at)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-white/60 mb-1">Last Sign In</h3>
                  <p className="text-lg">{formatDate(user.last_sign_in_at)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-white/60 mb-1">Status</h3>
                  <p className="text-lg">
                    <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Active
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-xl font-medium mb-4">Account Security</h3>
              
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all mr-4">
                Change Password
              </button>
              
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all">
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 