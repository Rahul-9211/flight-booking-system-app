'use client';

import { create } from 'zustand';
import { authService } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (userData: { email: string; password: string; full_name: string; phone_number?: string }) => Promise<any>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  isLoading: false,
  error: null,
  
  clearError: () => set({ error: null }),
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.signin({ email, password });
      const { token, refresh_token, user } = response.data;
      
      const responseUserProfile = await authService.getProfile(token);
      console.log('User profile:', responseUserProfile.data);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refresh_token);
      }
      
      // Extract user profile from the response
      const userProfile = {
        id: user.id,
        email: user.email,
        full_name: responseUserProfile.data.full_name,
        phone_number: user.phone || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      };
      console.log('User profile:', userProfile);
      
      set({ 
        token, 
        refreshToken: refresh_token,
        user: userProfile, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error: any) {
      set({ 
        error: error.message || 'Authentication failed', 
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },
  
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.signup(userData);
      const { token, refresh_token, user } = response.data;

      const responseUserProfile = await authService.getProfile(token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refresh_token);
      }
      
      // Extract user profile from the response
      const userProfile = {
        id: user.id,
        email: user.email,
        full_name: responseUserProfile.data.full_name,
        phone_number: user.phone || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      };
      
      set({ 
        token, 
        refreshToken: refresh_token,
        user: userProfile, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error: any) {
      set({ 
        error: error.message || 'Registration failed', 
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    
    try {
      // Call the signOut API
      await authService.signOut();
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      
      // Reset state
      set({ 
        token: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Even if the API call fails, we should still clear the local state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      
      set({ 
        token: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Failed to sign out'
      });
    }
  },
  
  loadUser: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    
    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }
    
    set({ isLoading: true });
    
    try {
      // For debugging
      console.log('Loading user with token:', token?.substring(0, 10) + '...' || 'no token');
      
      // Check if token is expired
      let currentToken = token;
      let currentRefreshToken = refreshToken;
      
      try {
        const decoded: any = token ? jwtDecode(token) : null;
        const currentTime = Date.now() / 1000;
        
        // If token is expired and we have a refresh token, try to refresh
        if (decoded && decoded.exp < currentTime && refreshToken) {
          console.log('Token expired, refreshing...');
          const refreshResponse = await authService.refreshToken(refreshToken);
          currentToken = refreshResponse.data.token;
          currentRefreshToken = refreshResponse.data.refresh_token;
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', currentToken);
            // localStorage.setItem('refreshToken', currentRefreshToken);
          }
          
          set({ 
            token: currentToken,
            refreshToken: currentRefreshToken
          });
        }
      } catch (decodeError) {
        console.error('Token decode error:', decodeError);
      }
      
      // Get user profile with the current token
      const response = await authService.getProfile(token);
      console.log('User profile loaded:', response.data);
      
      set({ 
        user: response.data, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Load user error:', error);
      
      // If there's an authentication error, clear the tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      
      set({ 
        token: null,
        refreshToken: null,
        isAuthenticated: false, 
        user: null, 
        isLoading: false,
        error: error.message || 'Failed to load user profile'
      });
    }
  }
})); 