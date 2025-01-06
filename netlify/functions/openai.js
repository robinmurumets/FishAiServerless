import fetch from 'node-fetch';

exports.handler = async (event) => {
  const apiKey = process.env.OPENAI_API_KEY; 

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: event.body, 
    });

    const data = await openaiResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch OpenAI API' }),
    };
  }
};
