import fetch from 'node-fetch';

export async function handler(event) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('API key is missing.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key is missing.' }),
    };
  }

  try {
    console.log('Request body:', event.body); // Log incoming request body

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: event.body, // Forward the request body directly
    });

    const data = await response.json();

    console.log('OpenAI API response:', data); // Log OpenAI API response

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching OpenAI API:', error); // Log errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch OpenAI API', details: error.message }),
    };
  }
}
