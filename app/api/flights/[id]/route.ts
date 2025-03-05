import { NextRequest, NextResponse } from 'next/server';
import { generateMockFlight } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // In a real application, you would fetch the flight from your database
    // For now, we'll generate a mock flight based on the ID
    
    // Extract flight details from the ID (format: origin-destination-flightNumber)
    const [origin, destination, flightNumber] = id.split('-');
    
    if (!origin || !destination || !flightNumber) {
      return NextResponse.json(
        { error: 'Invalid flight ID format' },
        { status: 400 }
      );
    }
    
    // Generate a mock flight with the extracted details
    const flight = generateMockFlight(origin, destination, flightNumber);
    
    return NextResponse.json(flight);
  } catch (error: any) {
    console.error('Error fetching flight details:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
} 