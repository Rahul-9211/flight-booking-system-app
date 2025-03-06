import { NextRequest, NextResponse } from 'next/server';

type ParamsType = Promise<{ id: string }>;
// Refund a completed payment
export async function POST(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  try {
    const { id } = await params;
    const paymentId = id;
    
    // In a real app, you would process the refund through a payment gateway
    // and update the payment record in your database
    // For now, we'll return mock data
    const mockRefundedPayment = {
      id: paymentId,
      status: 'refunded',
      refundedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(mockRefundedPayment);
  } catch (error: any) {
    console.error('Error refunding payment:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 