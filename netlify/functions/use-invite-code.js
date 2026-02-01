const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { code, email } = JSON.parse(event.body || '{}');

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Code is required' })
      };
    }

    const normalizedCode = code.trim().toUpperCase();

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: inviteCode, error: fetchError } = await supabase
      .from('invite_codes')
      .select('id, used_at')
      .eq('code', normalizedCode)
      .single();

    if (fetchError || !inviteCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid code' })
      };
    }

    if (inviteCode.used_at) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Code already used' })
      };
    }

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('invite_codes')
      .update({
        used_at: now,
        used_by_email: email || null
      })
      .eq('id', inviteCode.id);

    if (updateError) throw updateError;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Code used successfully' })
    };
  } catch (error) {
    console.error('Use invite code error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
