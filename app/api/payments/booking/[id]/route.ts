import { NextRequest, NextResponse } from 'next/server';

// Get payment details for a specific booking
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    
    // In a real app, you would fetch the payment from your database
    // For now, we'll return mock data
    const mockPayment = {
      id: 'pay_' + Math.random().toString(36).substring(2, 10),
      bookingId,
      amount: 299.99,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'credit_card',
      cardBrand: 'Visa',
      last4: '4242',
      createdAt: new Date().toISOString(),
    };
    
    return NextResponse.json(mockPayment);
  } catch (error: any) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 