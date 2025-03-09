import { NextResponse, NextRequest } from 'next/server';

export const maxDuration = 30; // Setting maximum duration to 30 seconds

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get the array of addresses
    const addresses = await req.json();
    
    console.log("Processing addresses:", addresses);

    // Create AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000);
    
    try {
      // Send the addresses to the external API
      const response = await fetch('http://127.0.0.1:5000/getMap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addresses }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // Check if the response is successful
      if (!response.ok) {
        console.log("Error response:", await response.json());
        return NextResponse.json({ error: 'Failed to get map data' }, { status: response.status });
      }

      // Parse and return the response
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out' }, { status: 504 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error processing map request:', error);
    return NextResponse.json({ error: 'Failed to process map request' }, { status: 500 });
  }
}