import { NextRequest, NextResponse } from 'next/server';

// Create a new payment for a booking
export async function POST(req: NextRequest) {
  try {
    const bookingData = await req.json();
    
    // Validate the request
    if (!bookingData.flightId || !bookingData.passengers || !bookingData.amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real app, you would create a payment record in your database
    // For now, we'll return mock data
    const mockPayment = {
      id: 'pay_' + Math.random().toString(36).substring(2, 10),
      bookingId: 'book_' + Math.random().toString(36).substring(2, 10),
      amount: bookingData.amount,
      currency: 'USD',
      status: 'pending',
      flightId: bookingData.flightId,
      passengers: bookingData.passengers,
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(mockPayment);
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 