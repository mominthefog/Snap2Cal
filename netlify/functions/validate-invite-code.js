const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const code = event.httpMethod === 'GET'
    ? event.queryStringParameters?.code
    : (JSON.parse(event.body || '{}')).code;

  if (!code || typeof code !== 'string') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ valid: false, error: 'Code is required' })
    };
  }

  const normalizedCode = code.trim().toUpperCase();

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: inviteCode, error } = await supabase
      .from('invite_codes')
      .select('id, subscriber_id, used_at, used_by_email')
      .eq('code', normalizedCode)
      .single();

    if (error || !inviteCode) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: false, reason: 'invalid' })
      };
    }

    if (inviteCode.used_at) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: false, reason: 'used' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: true,
        codeId: inviteCode.id,
        subscriberId: inviteCode.subscriber_id
      })
    };
  } catch (err) {
    console.error('Validate invite code error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ valid: false, error: 'Internal server error' })
    };
  }
};
