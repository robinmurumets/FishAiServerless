import fetch from 'node-fetch';

export async function handler(event) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('API key is missing from environment variables.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key is missing from server environment.' }),
    };
  }

  try {
    console.log('API key loaded successfully:', apiKey ? 'Yes' : 'No'); // Masked logging

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: event.body,
    });

    if (!response.ok) {
      console.error('Error from OpenAI API:', await response.text());
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch OpenAI API' }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Unexpected server error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected server error', details: error.message }),
    };
  }
}
