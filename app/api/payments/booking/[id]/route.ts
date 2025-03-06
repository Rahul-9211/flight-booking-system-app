import { NextRequest, NextResponse } from 'next/server';

// Get payment details for a specific booking
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Properly access the id from the params object
    const bookingId = context.params.id;
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would fetch the payment from your database
    // For now, we'll return mock data
    const mockPayment = {
      id: `payment-${bookingId}`,
      booking_id: bookingId,
      amount: 1250.00,
      currency: 'USD',
      status: 'completed',
      payment_method: 'credit_card',
      created_at: new Date().toISOString(),
      card_last4: '4242'
    };
    
    return NextResponse.json(mockPayment);
  } catch (error: any) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
} 