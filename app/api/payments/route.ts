import { NextRequest, NextResponse } from 'next/server';

// Get all payments for the current user
export async function GET(req: NextRequest) {
  try {
    // In a real app, you would fetch payments from your database
    // For now, we'll return mock data
    const mockPayments = [
      {
        id: 'pay_123456',
        bookingId: 'book_123456',
        amount: 299.99,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'credit_card',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'pay_123457',
        bookingId: 'book_123457',
        amount: 499.99,
        currency: 'USD',
        status: 'pending',
        paymentMethod: 'credit_card',
        createdAt: new Date().toISOString(),
      },
    ];
    
    return NextResponse.json(mockPayments);
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 