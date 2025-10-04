export default async function handler(request, response) {
  // First, check if the request is a POST request.
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests are allowed' });
  }

  // This is where we securely get our secret API key.
  // 'process.env' is a special object on the server that holds our secrets.
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // If the secret key isn't found, send an error.
  if (!geminiApiKey) {
    return response.status(500).json({ message: 'API key not configured on the server' });
  }

  // The original Google Gemini API URL.
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

  try {
    // We make a 'fetch' request to the REAL Google API from our secure server.
    // We pass along the content that our website sent to us.
    const geminiResponse = await fetch(`${geminiApiUrl}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body), // Pass the user's prompt to Google
    });

    // Get the data back from Google.
    const data = await geminiResponse.json();

    // If Google sends back an error, we send that error back to our website.
    if (!geminiResponse.ok) {
        console.error('Gemini API Error:', data);
        return response.status(geminiResponse.status).json(data);
    }
    
    // If everything is okay, we send Google's successful response back to our website!
    response.status(200).json(data);

  } catch (error) {
    // If anything else goes wrong, we catch the error.
    console.error('Proxy Error:', error);
    response.status(500).json({ message: 'An internal server error occurred' });
  }
}