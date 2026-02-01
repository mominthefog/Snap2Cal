-- Subscribers table (landing signups)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing',
  invite_codes_allocated INT DEFAULT 3,
  drip_status TEXT DEFAULT 'pending',
  drip_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invite codes table
CREATE TABLE IF NOT EXISTS invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ,
  used_by_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast code lookups
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_subscriber ON invite_codes(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
