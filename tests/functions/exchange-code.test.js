// Set env vars before requiring the module (it reads them at load time)
process.env.GOOGLE_CLIENT_ID = 'test-web-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';

const { handler } = require('../../netlify/functions/exchange-code');

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

describe('exchange-code function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    test('returns 400 when no authorization code provided', async () => {
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({})
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(400);
      expect(JSON.parse(result.body).error).toBe('No authorization code provided');
    });
  });

  describe('OAuth token exchange', () => {
    test('successfully exchanges code for tokens (web flow)', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          expires_in: 3600
        })
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          code: 'test-auth-code',
          redirect_uri: 'postmessage'
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.access_token).toBe('test-access-token');
      expect(body.refresh_token).toBe('test-refresh-token');

      // Verify web client was used
      const fetchCall = fetch.mock.calls[0];
      const bodyParams = new URLSearchParams(fetchCall[1].body);
      expect(bodyParams.get('client_id')).toBe('test-web-client-id');
      expect(bodyParams.get('client_secret')).toBe('test-client-secret');
    });

    test('uses iOS client ID for iOS redirect URI', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'test-access-token',
          refresh_token: 'test-refresh-token',
          expires_in: 3600
        })
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          code: 'test-auth-code',
          redirect_uri: 'com.googleusercontent.apps.406862514908-vpkcj0altrgjo9puga6aiq7bs1o4ativ:/'
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(200);

      // Verify iOS client was used and no client_secret
      const fetchCall = fetch.mock.calls[0];
      const bodyParams = new URLSearchParams(fetchCall[1].body);
      expect(bodyParams.get('client_id')).toBe('406862514908-vpkcj0altrgjo9puga6aiq7bs1o4ativ.apps.googleusercontent.com');
      expect(bodyParams.has('client_secret')).toBe(false);
    });

    test('handles Google OAuth errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'invalid_grant',
          error_description: 'Code has expired'
        })
      });

      const event = {
        httpMethod: 'POST',
        body: JSON.stringify({
          code: 'expired-code',
          redirect_uri: 'postmessage'
        })
      };
      const result = await handler(event, {});

      expect(result.statusCode).toBe(401);
      expect(JSON.parse(result.body).error).toBe('Failed to exchange code');
    });
  });
});
