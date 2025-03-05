import axios from 'axios';

// Base API URL - replace with your actual API URL when available
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
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

// Auth services
export const authService = {
  signin: (data: { email: string; password: string }) => 
    api.post('/auth/signin', data),
  signup: (data: { email: string; password: string; full_name: string; phone_number?: string }) => 
    api.post('/auth/signup', data),
  getProfile: () => api.get('/auth/profile'),
};

// Flight services
export const flightService = {
  searchFlights: (params: Record<string, string>) => {
    // For demo purposes, return mock data
    return Promise.resolve({
      data: generateMockFlights(params)
    });
  },
  getFlightById: (id: string) => {
    // For demo purposes, return a mock flight
    return Promise.resolve({
      data: generateMockFlight(id)
    });
  },
};

// Booking services
export const bookingService = {
  createBooking: (bookingData: any) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings'),
  getBookingById: (id: string) => api.get(`/bookings/${id}`),
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