import { NextRequest, NextResponse } from 'next/server';
import { flightService } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Flight ID is required' },
        { status: 400 }
      );
    }
    
    const flight = await flightService.getFlightById(id);
    
    if (!flight) {
      return NextResponse.json(
        { error: 'Flight not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(flight);
  } catch (error: any) {
    console.error('Error fetching flight:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch flight details' },
      { status: 500 }
    );
  }
} 