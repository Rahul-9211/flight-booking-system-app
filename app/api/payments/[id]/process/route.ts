import { NextRequest, NextResponse } from 'next/server';

// Process a pending payment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id;
    const paymentDetails = await req.json();
    
    // Validate the request
    if (!paymentDetails.paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would process the payment through a payment gateway
    // and update the payment record in your database
    // For now, we'll return mock data
    const mockProcessedPayment = {
      id: paymentId,
      status: 'completed',
      paymentMethod: paymentDetails.paymentMethod,
      cardBrand: paymentDetails.cardBrand || 'Visa',
      last4: paymentDetails.last4 || '4242',
      processedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(mockProcessedPayment);
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 