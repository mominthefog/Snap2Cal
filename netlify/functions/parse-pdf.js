const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { fileContent, fileName } = JSON.parse(event.body);

    if (!fileContent) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file content provided' })
      };
    }

    // Extract base64 data and media type from data URL
    const matches = fileContent.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid file content format' })
      };
    }
    const mediaType = matches[1];
    const base64Data = matches[2];

    const systemPrompt = `You are a calendar event extraction assistant. Extract all events from the provided document and return them as a JSON array. Each event should follow Google Calendar API format with:
- summary (string) - the event name/title
- start (object) - use {"dateTime": "ISO format"} for timed events OR {"date": "YYYY-MM-DD"} for all-day events
- end (object) - use {"dateTime": "ISO format"} for timed events OR {"date": "YYYY-MM-DD"} for all-day events
- description (string, optional)
- location (string, optional)

IMPORTANT: If no specific time is mentioned, use the "date" format for all-day events. Only use "dateTime" when a specific time is clearly stated.

Return ONLY valid JSON with no additional text or markdown formatting.`;

    // Call Claude API with your server-side API key
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data
                }
              },
              {
                type: 'text',
                text: `Extract all calendar events from this document (${fileName}). Return as JSON array.`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API Error:', errorData);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'Claude API request failed',
          details: errorData
        })
      };
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Try to parse the JSON response
    let events;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      events = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to parse events from AI response',
          rawContent: content
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        events,
        rawResponse: content  // Include for debugging
      })
    };

  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
