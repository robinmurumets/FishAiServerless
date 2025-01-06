export async function handler(event) {
    const { conversation } = JSON.parse(event.body);
  
    if (!conversation || !Array.isArray(conversation)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid conversation format" }),
      };
    }
  
    const apiKey = process.env.OPENAI_API_KEY;
  
    try {
      // Use the built-in fetch in Node 18
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: conversation,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: errorData }),
        };
      }
  
      const data = await response.json();
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: data.choices[0].message.content }),
      };
    } catch (error) {
      console.error("Error fetching from OpenAI:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch from OpenAI API" }),
      };
    }
  }
  