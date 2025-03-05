import axios from 'axios';

// Base API URL - replace with your actual API URL when available
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fstydhiwdzwsjgkbaomz.supabase.co/auth/v1';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Check if we have a refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          console.log('Attempting to refresh token...');
          
          // Try to refresh the token
          const response = await authService.refreshToken(refreshToken);
          const { token } = response.data;
          
          // Update the token in localStorage
          localStorage.setItem('token', token);
          
          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear auth state on refresh failure
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          // Redirect to login page if we're in the browser
          window.location.href = '/signin?redirect=' + window.location.pathname;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  signin: async (credentials: { email: string; password: string }) => {
    try {
      // Make a real API call to the authentication endpoint
      const response = await api.post('/auth/signin', {
        email: credentials.email,
        password: credentials.password,
      });
      
      // Process the response from the real API
      return {
        data: {
          token: response.data.session.access_token,
          refresh_token: response.data.session.refresh_token,
          user: response.data.user
        }
      };  
    } catch (error: any) {
      console.error('Signin error:', error);
      
      // Enhanced error handling with specific error messages
      if (error.response) {
        // Server responded with an error status
        const status = error.response.status;
        const responseData = error.response.data;
        
        if (status === 400) {
          if (responseData.message?.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.');
          } else if (responseData.message?.includes('Email not confirmed')) {
            throw new Error('Please verify your email address before signing in.');
          } else {
            throw new Error(responseData.message || 'Invalid request. Please check your information.');
          }
        } else if (status === 401) {
          // Handle 401 Unauthorized errors
          console.log('401 Unauthorized error details:', responseData);
          
          if (responseData.error === 'invalid_grant') {
            throw new Error('Invalid email or password. Please try again.');
          } else if (responseData.message?.includes('Invalid token')) {
            throw new Error('Your session has expired. Please sign in again.');
          } else if (responseData.message?.includes('API key')) {
            throw new Error('Authentication error. Please contact support.');
          } else {
            throw new Error(responseData.message || 'Authentication failed. Please check your credentials.');
          }
        } else if (status === 404) {
          throw new Error('User not found. Please check your email or sign up for a new account.');
        } else if (status === 429) {
          throw new Error('Too many sign-in attempts. Please try again later.');
        } else {
          throw new Error(responseData.message || 'Authentication failed. Please try again later.');
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check your internet connection and try again.');
      } else {
        // Error setting up the request
        throw new Error('Error setting up request: ' + error.message);
      }
    }
  },
  
  signup: async (userData: { 
    email: string; 
    password: string; 
    full_name: string; 
    phone_number?: string 
  }) => {
    try {
      // First, create the user account
      const signupResponse = await api.post('/auth/signup', {
        email: userData.email,
        password: userData.password,
        data: {
          full_name: userData.full_name,
          phone_number: userData.phone_number || ''
        }
      });
      
      // Then sign in to get the session
      const signinResponse = await authService.signin({
        email: userData.email,
        password: userData.password
      });
      
      return signinResponse;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Enhanced error handling
      if (error.response) {
        const errorMessage = error.response.data?.error_description || 
                            error.response.data?.message || 
                            'Registration failed';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        throw new Error('Error setting up request: ' + error.message);
      }
    }
  },
  
    getProfile: async (token: string) => {
    try {
      console.log('Token:', token);
      // Make a real API call to get the user profile
      const response = await api.get('/auth/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );  
      console.log('Profile response:', response.data);
      // Process the response from the real API
      return {
        data: {
          id: response.data.id,
          email: response.data.email,
          full_name: response.data.full_name,
          phone_number: response.data.phone || '',
          created_at: response.data.created_at,
          last_sign_in_at: response.data.last_sign_in_at
        }
      };
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      if (error.response && error.response.status === 401) {
        throw new Error('Session expired. Please sign in again.');
      } else if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to load profile');
      } else if (error.request) {
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        throw new Error('Error setting up request: ' + error.message);
      }
    }
  },
  
  refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post('/auth/v1/token?grant_type=refresh_token', {
        refresh_token: refreshToken
      });
      
      return {
        data: {
          token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          user: response.data.user
        }
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },
  
  signOut: async () => {
    try {
      // Make a real API call to sign out
      // await api.post('/auth/v1/logout', {});
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      
      // Even if the API call fails, clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      
      throw error;
    }
  }
};

// Flight services
export const flightService = {
  searchFlights: async (params: Record<string, string>) => {
    try {
      const response = await api.get('/flights', { params });
      return response;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },
  getFlightById: async (id: string) => {
    try {
      const response = await api.get(`/flights/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching flight ${id}:`, error);
      throw error;
    }
  },
  getAllFlights: async () => {
    try {
      const response = await api.get('/flights');
      return response.data;
    } catch (error) {
      console.error('Error fetching all flights:', error);
      throw error;
    }
  }
};

// Booking services
export const bookingService = {
  createBooking: (bookingData: any) => api.post('/bookings', bookingData),
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },
  getBookingById: async (id: string) => {
    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Make API call with token in header
      const response = await api.get(`/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },
  cancelBooking: (id: string) => api.put(`/bookings/${id}/cancel`),
  confirmBooking: (id: string) => api.put(`/bookings/${id}/confirm`),
};

// Payment services
export const paymentService = {
  getUserPayments: () => api.get('/payments'),
  getPaymentByBookingId: (bookingId: string) => api.get(`/payments/booking/${bookingId}`),
  processPayment: (paymentId: string) => api.post(`/payments/${paymentId}/process`),
  refundPayment: (paymentId: string) => api.post(`/payments/${paymentId}/refund`),
};

// Helper functions to generate mock data
function generateMockFlights(params: Record<string, string>) {
  const count = 5 + Math.floor(Math.random() * 5);
  const flights = [];
  
  const cities = ['NYC', 'LAX', 'CHI', 'MIA', 'SFO', 'DFW', 'SEA', 'BOS', 'LAS', 'ATL'];
  const airlines = ['Cosmic Airways', 'Stellar Airlines', 'Quantum Jets', 'Nebula Air'];
  
  const origin = params.origin || cities[Math.floor(Math.random() * cities.length)];
  const destination = params.destination || cities.filter(c => c !== origin)[Math.floor(Math.random() * (cities.length - 1))];
  
  for (let i = 0; i < count; i++) {
    const departureHour = 6 + Math.floor(Math.random() * 12);
    const flightDuration = 2 + Math.floor(Math.random() * 6);
    const departureDate = params.departure_date || '2024-06-15';
    const departureTime = `${departureDate}T${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`;
    const arrivalTime = new Date(new Date(departureTime).getTime() + flightDuration * 60 * 60 * 1000).toISOString();
    
    flights.push({
      id: `FL-${1000 + i}`,
      flight_number: `CS${100 + Math.floor(Math.random() * 900)}`,
      origin,
      destination,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      price: 100 + Math.floor(Math.random() * 900),
      available_seats: 5 + Math.floor(Math.random() * 50),
      airline: airlines[Math.floor(Math.random() * airlines.length)]
    });
  }
  
  return flights;
}

function generateMockFlight(id: string) {
  const cities = ['NYC', 'LAX', 'CHI', 'MIA', 'SFO', 'DFW', 'SEA', 'BOS'];
  const airlines = ['Cosmic Airways', 'Stellar Airlines', 'Quantum Jets', 'Nebula Air'];
  const aircraft = ['Boeing 787-9', 'Airbus A350-900', 'Quantum X-1000', 'Stellar Cruiser'];
  
  const fromCity = cities[Math.floor(Math.random() * cities.length)];
  const toCity = cities.filter(c => c !== fromCity)[Math.floor(Math.random() * (cities.length - 1))];
  
  const departureHour = 6 + Math.floor(Math.random() * 12);
  const flightDuration = 2 + Math.floor(Math.random() * 6);
  const departureTime = `2024-06-15T${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`;
  const arrivalTime = new Date(new Date(departureTime).getTime() + flightDuration * 60 * 60 * 1000).toISOString();
  
  return {
    id,
    flight_number: `CS${id.slice(-3)}`,
    origin: fromCity,
    destination: toCity,
    departure_time: departureTime,
    arrival_time: arrivalTime,
    price: 100 + Math.floor(Math.random() * 900),
    available_seats: 5 + Math.floor(Math.random() * 50),
    airline: airlines[Math.floor(Math.random() * airlines.length)],
    aircraft: aircraft[Math.floor(Math.random() * aircraft.length)],
    terminal: `T${Math.floor(Math.random() * 5) + 1}`,
    gate: `G${Math.floor(Math.random() * 20) + 1}`,
    status: 'On Time'
  };
}

export default api; 