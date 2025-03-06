import { NextRequest, NextResponse } from 'next/server';

type ParamsType = Promise<{ id: string }>;
// Get payment details for a specific booking
export async function GET(
  request: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    const { id } = await params;
    const bookingId =id;
    
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