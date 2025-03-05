import { create } from 'zustand';
import { authService } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id?: string;
  email: string;
  full_name: string;
  phone_number?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { email: string; password: string; full_name: string; phone_number?: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would call the API
      // const response = await authService.signin({ email, password });
      // const { token, user } = response.data;
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock token and user
      const token = 'mock-jwt-token';
      const user = {
        id: 'user-123',
        email,
        full_name: 'Demo User',
      };
      
      localStorage.setItem('token', token);
      
      set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Authentication failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, we would call the API
      // const response = await authService.signup(userData);
      // const { token, user } = response.data;
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock token and user
      const token = 'mock-jwt-token';
      const user = {
        id: 'user-123',
        email: userData.email,
        full_name: userData.full_name,
        phone_number: userData.phone_number,
      };
      
      localStorage.setItem('token', token);
      
      set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ 
      token: null, 
      user: null, 
      isAuthenticated: false 
    });
  },
  
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    
    set({ isLoading: true });
    
    try {
      // In a real app, we would call the API
      // const response = await authService.getProfile();
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user
      const user = {
        id: 'user-123',
        email: 'user@example.com',
        full_name: 'Demo User',
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ 
        token: null, 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      });
    }
  }
})); 