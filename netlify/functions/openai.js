import fetch from 'node-fetch';

export async function handler(event) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('Missing API key.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key is missing.' }),
    };
  }

  try {
    console.log('Incoming request body:', event.body); // Log request body

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: event.body, // Forward the body from the frontend
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', await openAIResponse.text()); // Log API errors
      return {
        statusCode: openAIResponse.status,
        body: JSON.stringify({ error: 'Failed to fetch OpenAI API' }),
      };
    }

    const data = await openAIResponse.json();
    console.log('OpenAI response:', data); // Log successful response

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error.message); // Log unexpected errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error occurred', details: error.message }),
    };
  }
}
