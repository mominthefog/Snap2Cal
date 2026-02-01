const { handler } = require('../../netlify/functions/parse-pdf');

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

describe('parse-pdf function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
  });

  describe('CORS and HTTP methods', () => {
    test('handles OPTIONS preflight request', async () => {
      const event = { httpMethod: 'OPTIONS' };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(200);
      expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
      expect(result.headers['Access-Control-Allow-Methods']).toContain('POST');
    });

    test('rejects non-POST methods', async () => {
      const event = { httpMethod: 'GET' };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(405);
      expect(JSON.parse(result.body).error).toBe('Method not allowed');
    });
  });

  describe('Input validation', () => {
    test('returns 400 when no file content provided', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({ fileName: 'test.png' })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('No file content provided');
    });

    test('returns 400 for invalid base64 format', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          fileContent: 'not-a-valid-data-url',
          fileName: 'test.png'
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('Invalid file content format');
    });
  });

  describe('Claude API integration', () => {
    test('successfully parses events from Claude response', async () => {
      const mockEvents = {
        events: [{ summary: 'Test Event', start: { date: '2025-01-15' }, end: { date: '2025-01-15' } }],
        message: 'Found 1 event'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ text: JSON.stringify(mockEvents) }]
        })
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          fileContent: 'data:image/png;base64,iVBORw0KGgo=',
          fileName: 'test.png',
          clientDate: 'Monday, January 15, 2025',
          clientYear: 2025
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.events).toHaveLength(1);
      expect(body.events[0].summary).toBe('Test Event');
      expect(body.message).toBe('Found 1 event');
    });

    test('handles Claude API errors gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'API Error'
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          fileContent: 'data:image/png;base64,iVBORw0KGgo=',
          fileName: 'test.png'
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).error).toBe('Claude API request failed');
    });

    test('handles malformed JSON from Claude', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ text: 'This is not valid JSON' }]
        })
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          fileContent: 'data:image/png;base64,iVBORw0KGgo=',
          fileName: 'test.png'
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.events).toEqual([]);
      expect(body.message).toContain('trouble reading');
    });

    test('passes client date context to Claude API in system prompt and user message', async () => {
      const clientDate = 'Thursday, January 29, 2026';
      const clientYear = 2026;

      fetch.mockImplementation((url, options) => {
        const requestBody = JSON.parse(options.body);
        expect(requestBody.system).toContain(clientDate);
        expect(requestBody.system).toContain('2026-01-29');
        expect(requestBody.system).toContain(String(clientYear));
        expect(requestBody.system).toContain('Do NOT assume March or later months have passed');

        const userText = requestBody.messages[0].content.find(c => c.type === 'text').text;
        expect(userText).toContain(`Today is ${clientDate}`);
        expect(userText).toContain('Extract all calendar events');

        return Promise.resolve({
          ok: true,
          json: async () => ({
            content: [{ text: JSON.stringify({ events: [], message: 'No events' }) }]
          })
        });
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          fileContent: 'data:image/png;base64,iVBORw0KGgo=',
          fileName: 'flyer.png',
          clientDate,
          clientYear
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(200);
      expect(fetch).toHaveBeenCalled();
    });
  });
});
