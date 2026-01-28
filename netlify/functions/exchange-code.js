const fetch = require('node-fetch');

// Client IDs for web vs iOS
const WEB_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const IOS_CLIENT_ID = '406862514908-vpkcj0altrgjo9puga6aiq7bs1o4ativ.apps.googleusercontent.com';
const IOS_REDIRECT_URI = 'com.googleusercontent.apps.406862514908-vpkcj0altrgjo9puga6aiq7bs1o4ativ:/';

exports.handler = async (event, context) => {
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code, redirect_uri } = JSON.parse(event.body);

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No authorization code provided' })
      };
    }

    // Use iOS client ID if the redirect_uri is the iOS redirect
    const isIOS = redirect_uri && redirect_uri.startsWith('com.googleusercontent.apps.');
    const clientId = isIOS ? IOS_CLIENT_ID : WEB_CLIENT_ID;

    console.log('Token exchange - isIOS:', isIOS, 'redirect_uri:', redirect_uri);

    // Build request body - iOS doesn't use client_secret
    const tokenParams = {
      client_id: clientId,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri || 'postmessage'
    };

    // Only include client_secret for web (not iOS)
    if (!isIOS) {
      tokenParams.client_secret = process.env.GOOGLE_CLIENT_SECRET;
    }

    // Exchange authorization code for tokens
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(tokenParams)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google OAuth Error:', data);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: 'Failed to exchange code',
          details: data.error_description || data.error
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in
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
