"use server"

export async function getAddress(addresses: string[]) {
  try {
    console.log("Processing addresses:", addresses);

    // Create AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500000);
    
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
        const errorData = await response.json();
        console.log("Error response:", errorData);
        return { error: 'Failed to get map data', success: false };
      }

      // Parse and return the response
      const data = await response.json();
      return { data: data, success: true };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return { error: 'Request timed out', success: false };
      }
      throw error;
    }
  } catch (error) {
    console.error('Error processing map request:', error);
    return { error: 'Failed to process map request', success: false };
  }
}