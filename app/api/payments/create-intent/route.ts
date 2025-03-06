import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, flightId, passengers, receipt_email } = await req.json();

    // Validate the request
    if (!amount || !currency || !flightId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate a fake payment intent ID
    const paymentIntentId = `pi_${Date.now()}${Math.random().toString(36).substring(2, 8)}`;
    
    // Generate a fake client secret
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substring(2, 15)}`;

    // Simulate a slight delay to make it feel real
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return the client secret to the client
    return NextResponse.json({ 
      clientSecret,
      id: paymentIntentId
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 