import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Stripe webhook secret for verifying events
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      // Verify the event came from Stripe
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessfulPayment(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleFailedPayment(failedPaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  // Extract metadata
  const { flightId, passengers } = paymentIntent.metadata;
  
  // Here you would typically:
  // 1. Create a booking record in your database
  // 2. Update flight availability
  // 3. Send confirmation email to the customer
  // 4. Log the transaction
  
  console.log(`Payment succeeded for flight ${flightId} with ${passengers} passengers`);
  
  // Example implementation:
  // await db.bookings.create({
  //   paymentIntentId: paymentIntent.id,
  //   flightId,
  //   passengers: parseInt(passengers),
  //   amount: paymentIntent.amount / 100,
  //   customerEmail: paymentIntent.receipt_email,
  //   status: 'confirmed',
  //   createdAt: new Date(),
  // });
  
  // await db.flights.update({
  //   where: { id: flightId },
  //   data: {
  //     availableSeats: { decrement: parseInt(passengers) }
  //   }
  // });
  
  // await sendConfirmationEmail(paymentIntent.receipt_email, {
  //   bookingId: newBooking.id,
  //   flightId,
  //   amount: paymentIntent.amount / 100,
  //   passengers
  // });
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  // Log failed payment
  console.log(`Payment failed for payment intent ${paymentIntent.id}`);
  
  // You might want to notify the customer or take other actions
} 