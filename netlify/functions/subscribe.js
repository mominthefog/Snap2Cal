const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Generate a unique invite code (S2C-XXXX-XXXX format)
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0, O, 1, I to avoid confusion
  let code = 'S2C-';
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  code += '-';
  for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

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
    const { email, source } = JSON.parse(event.body || '{}');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email is required' })
      };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      // Return existing codes
      const { data: codes } = await supabase
        .from('invite_codes')
        .select('code, used_at')
        .eq('subscriber_id', existing.id)
        .order('created_at', { ascending: true });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Already subscribed',
          codes: (codes || []).map((c) => ({ code: c.code, used: !!c.used_at }))
        })
      };
    }

    // Insert new subscriber
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        source: source || 'landing'
      })
      .select('id')
      .single();

    if (subError) throw subError;

    // Generate 3 unique codes
    const codes = [];
    const seen = new Set();
    while (codes.length < 3) {
      const code = generateInviteCode();
      if (!seen.has(code)) {
        seen.add(code);
        codes.push({ code, subscriber_id: subscriber.id });
      }
    }

    // Insert codes
    const { error: codesError } = await supabase
      .from('invite_codes')
      .insert(codes.map((c) => ({ code: c.code, subscriber_id: c.subscriber_id })));

    if (codesError) throw codesError;

    const codeStrings = codes.map((c) => c.code);

    // Optional: Resend integration for email drip
    const resendKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM_EMAIL || 'Snap2Cal <hello@snap2cal.ai>';
    const appUrl = process.env.SNAP2CAL_APP_URL || 'https://app.snap2cal.ai';

    if (resendKey) {
      try {
        await fetch('https://api.resend.com/contacts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            unsubscribed: false
          })
        });

        // Send welcome email with invite codes
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [email],
            subject: 'Your Snap2Cal beta invite codes are ready',
            html: `
              <p>Thanks for joining the Snap2Cal beta!</p>
              <p>Here are your 3 invite codes. Use one yourself and share the rest with friends.</p>
              <ul style="list-style: none; padding: 0;">
                ${codeStrings.map((c) => `<li style="margin: 8px 0; font-family: monospace; font-size: 16px;">${c}</li>`).join('')}
              </ul>
              <p><a href="${appUrl}?code=${encodeURIComponent(codeStrings[0])}" style="background: #d4a088; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600;">Use a code and open Snap2Cal</a></p>
              <p style="color: #666; font-size: 14px;">One Snap. Zero Mental Load.</p>
            `
          })
        });
      } catch (resendErr) {
        console.error('Resend integration error:', resendErr);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Subscribed successfully',
        codes: codeStrings.map((code) => ({ code, used: false }))
      })
    };
  } catch (error) {
    console.error('Subscribe Error:', error);
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
