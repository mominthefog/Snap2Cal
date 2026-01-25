const { createClient } = require('@supabase/supabase-js');

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
    const { email, name, googleId, picture } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Initialize Supabase client with service role key for server-side operations
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const now = new Date().toISOString();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Update existing user
      const { error } = await supabase
        .from('users')
        .update({
          last_seen: now,
          sign_in_count: existingUser.sign_in_count + 1
        })
        .eq('email', email);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'User updated',
          isNewUser: false
        })
      };
    } else {
      // Insert new user
      const { error } = await supabase
        .from('users')
        .insert({
          email,
          name: name || null,
          google_id: googleId || null,
          picture: picture || null,
          first_seen: now,
          last_seen: now,
          sign_in_count: 1
        });

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'User logged',
          isNewUser: true
        })
      };
    }

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
