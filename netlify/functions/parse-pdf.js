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
    const { fileContent, fileName, clientDate, clientYear } = JSON.parse(event.body);

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

    // Use client-provided date for accurate timezone handling
    // Fall back to server date if not provided (backwards compatibility)
    const today = new Date();
    const todayFormatted = clientDate || today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const currentYear = clientYear || today.getFullYear();
    const nextYear = currentYear + 1;

    const systemPrompt = `You are a calendar event extraction assistant. Extract all events from the provided document and return them as JSON.

Your response must be a JSON object with this structure:
{
  "events": [...],
  "message": "..."
}

For the "events" array, each event should follow Google Calendar API format with:
- summary (string) - the event name/title (use "Untitled Event" if no title is visible)
- start (object) - use {"dateTime": "ISO format"} for timed events OR {"date": "YYYY-MM-DD"} for all-day events
- end (object) - use {"dateTime": "ISO format"} for timed events OR {"date": "YYYY-MM-DD"} for all-day events
- description (string, optional)
- location (string, optional)

HANDLING PARTIAL INFORMATION:
- If an event has a title but no date, DO NOT include it in the events array. Mention it in the message (e.g., "I also saw 'Soccer Practice' mentioned but couldn't find a date for it.")
- If an event has a date but no clear title, include it with summary "Untitled Event" and note what you saw in the description
- Always include whatever details you can extract — users can edit events after adding them

HANDLING DATES:
- Today's date is: ${todayFormatted}
- If no year is specified, assume the current year (${currentYear})
- If the date has already passed this year, assume next year (${nextYear})
- If no specific time is mentioned, use the "date" format for all-day events
- Only use "dateTime" when a specific time is clearly stated

HANDLING RECURRING EVENTS:
- If an event appears to be recurring (e.g., "every Tuesday" or "weekly"), create only ONE event for the first/next occurrence
- Note the recurrence pattern in the description (e.g., "Note: This appears to be a recurring event (every Tuesday)")
- Do NOT create multiple events for recurring patterns

For the "message" field:
- If events were found: briefly confirm what you extracted (e.g., "Found 3 events from the school newsletter")
- If partial information was found: mention what couldn't be fully captured (e.g., "Found 2 events. I also saw 'Book Club' mentioned but couldn't find a date for it.")
- If no events found: explain specifically why in a friendly, helpful way (e.g., "This looks like a restaurant menu — I didn't see any dates or scheduled events. Try uploading an event flyer or invitation!")

IMPORTANT:
- Return ONLY valid JSON with no additional text or markdown formatting`;

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
                text: `Extract all calendar events from this document (${fileName}). Return as JSON object with events array and message.`
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
    let events = [];
    let message = '';

    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanedContent);

      // Handle both old format (array) and new format (object with events/message)
      if (Array.isArray(parsed)) {
        events = parsed;
        message = events.length > 0 ? `Found ${events.length} event(s)` : '';
      } else {
        events = parsed.events || [];
        message = parsed.message || '';
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return {
        statusCode: 200,  // Still return 200 so frontend can show the message
        headers,
        body: JSON.stringify({
          events: [],
          message: "I had trouble reading that image. Could you try a clearer photo?",
          rawResponse: content
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        events,
        message,
        rawResponse: content
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
