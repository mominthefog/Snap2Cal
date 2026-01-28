const { handler } = require('../../netlify/functions/refresh-token');

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

describe('refresh-token function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
  });

  describe('CORS and HTTP methods', () => {
    test('handles OPTIONS preflight request', async () => {
      const event = { httpMethod: 'OPTIONS' };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(200);
      expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
    });

    test('rejects non-POST methods', async () => {
      const event = { httpMethod: 'GET' };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(405);
      expect(JSON.parse(result.body).error).toBe('Method not allowed');
    });
  });

  describe('Input validation', () => {
    test('returns 400 when no refresh token provided', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({})
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('No refresh token provided');
    });
  });

  describe('Token refresh', () => {
    test('successfully refreshes access token', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'new-access-token',
          expires_in: 3600
        })
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          refresh_token: 'valid-refresh-token'
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.access_token).toBe('new-access-token');
      expect(body.expires_in).toBe(3600);
    });

    test('handles expired/invalid refresh token', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'invalid_grant',
          error_description: 'Token has been revoked'
        })
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          refresh_token: 'revoked-token'
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(401);
      expect(JSON.parse(result.body).error).toBe('Failed to refresh token');
    });
  });
});
