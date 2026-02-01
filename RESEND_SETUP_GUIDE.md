# Resend Setup Guide for Snap2Cal

**Date:** February 1, 2026  
**Purpose:** Configure email automation for beta launch welcome emails and drip campaigns

---

## Step 1: Resend Account Setup

### 1.1 Create Account
- [x] Sign up at https://resend.com
- [ ] Verify your email address

### 1.2 Add and Verify Sending Domain

**⚠️ IMPORTANT: Use a Subdomain (Resend Best Practice)**

Resend recommends using a subdomain instead of your root domain for proper reputation segmentation.

**Option A: Use a Subdomain (RECOMMENDED)**

Choose one of these subdomains:
- `updates.snap2cal.ai` - For product updates and announcements
- `hello.snap2cal.ai` - Friendly, matches your brand voice
- `mail.snap2cal.ai` - Straightforward option

**Setup steps:**
1. Go to Domains in Resend dashboard
2. Add domain: `updates.snap2cal.ai` (or your chosen subdomain)
3. Add the DNS records Resend provides to your domain registrar/DNS provider:
   - SPF record (TXT)
   - DKIM record (TXT)
   - DMARC record (TXT - optional but recommended)
4. Wait for verification (usually 5-30 minutes)
5. Use sender: `Snap2Cal <hello@updates.snap2cal.ai>` or `noreply@updates.snap2cal.ai`

**Why subdomain?**
- Protects your root domain reputation
- Better email deliverability
- Allows segmentation if you add marketing emails later
- Industry best practice

**Option B: Use Resend's shared domain (Quick testing only)**
1. Use: `onboarding@resend.dev` (no verification needed)
2. Good for initial testing, but **must** switch to custom subdomain before beta launch

### 1.3 Get API Key
1. Go to API Keys in Resend dashboard
2. Create new API key
3. Name it: "Snap2Cal Production" or "Snap2Cal Beta"
4. Copy the key (starts with `re_`)
5. ⚠️ **Save it securely** - you won't see it again!

---

## Step 2: Add Environment Variables to Netlify

### 2.1 Access Netlify Environment Variables
1. Go to https://app.netlify.com
2. Select your Snap2Cal site
3. Go to Site Configuration → Environment Variables
4. Click "Add a variable"

### 2.2 Add Resend Variables

**Variable 1: RESEND_API_KEY**
- Key: `RESEND_API_KEY`
- Value: `re_your_actual_api_key_here`
- Scopes: All (or select Production/Deploy Previews as needed)

**Variable 2: RESEND_FROM_EMAIL**
- Key: `RESEND_FROM_EMAIL`
- Value: `Snap2Cal <hello@updates.snap2cal.ai>` (or your chosen subdomain)
  - OR `onboarding@resend.dev` if using shared domain for testing
- Scopes: All

**💡 Recommendation:** Use `hello@updates.snap2cal.ai` - friendly and follows best practices

**Variable 3: SNAP2CAL_APP_URL** (if not already set)
- Key: `SNAP2CAL_APP_URL`
- Value: `https://app.snap2cal.ai` (or your app URL)
- Scopes: All

### 2.3 Deploy to Apply Changes
After adding environment variables:
1. Go to Deploys tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait for deploy to complete (~2-3 minutes)

---

## Step 3: Test Welcome Email

### 3.1 Test Signup Flow
1. Go to your landing page: https://snap2cal.ai/landing.html (or wherever it's hosted)
2. Enter a **test email you control** (not your main email yet)
3. Click "Join the Waitlist"
4. Check your inbox for the welcome email

### 3.2 What to Look For
The email should include:
- ✅ Subject: "Your Snap2Cal beta invite codes are ready"
- ✅ Body: Welcome message
- ✅ 3 invite codes in monospace format (S2C-XXXX-XXXX)
- ✅ CTA button: "Use a code and open Snap2Cal"
- ✅ Button links to app with first code: `https://app.snap2cal.ai?code=S2C-XXXX-XXXX`

### 3.3 Test the Code
1. Click the button in the email
2. Should redirect to app with code in URL
3. Verify code validates on the invite gate
4. Test signing in with Google

### 3.4 Troubleshooting
If email doesn't arrive:
- Check Netlify function logs: Site → Functions → subscribe → Recent logs
- Check Resend logs: Resend dashboard → Emails
- Verify API key is correct and has sending permissions
- Check spam folder
- Verify domain is verified (if using custom domain)

---

## Step 4: Resend Dashboard Setup

### 4.1 Create Audience (Optional but Recommended)
1. Go to Audiences in Resend
2. Create audience: "Snap2Cal Beta Waitlist"
3. This will organize your contacts

### 4.2 Email Templates (Future Enhancement)
Once you're happy with the welcome email, you can:
1. Create templates in Resend for consistent branding
2. Use Resend's template system instead of inline HTML
3. Makes it easier to update email design later

---

## Step 5: Monitor and Verify

### Things to Check After Setup

**Netlify Function Logs:**
- Go to: Netlify → Functions → subscribe
- Check recent invocations for errors
- Should see successful Resend API calls

**Resend Dashboard:**
- Check Emails tab to see sent messages
- Verify delivery status
- Check open/click rates (if enabled)

**Supabase:**
- Check `subscribers` table for new entries
- Check `invite_codes` table for generated codes

---

## Current Email Implementation Status

### ✅ Email #1: Welcome + Invite Codes
**When:** Immediately upon signup  
**Subject:** "Your Snap2Cal beta invite codes are ready"  
**Status:** Fully implemented in `subscribe.js`  
**Content:** 
- Welcome message
- 3 invite codes
- CTA to use first code

### ❌ Email #2-4: Drip Sequence (Not Yet Implemented)
According to your GOTM plan:

**Email #2 (+2 days after signup)**
- Subject: TBD
- Content: Use case + "Try Snap2Cal today"

**Email #3 (+5 days after signup)**
- Subject: TBD
- Content: Tips for multi-event images + reminder to share codes

**Email #4 (+7 days after signup)**
- Subject: TBD
- Content: "Share with a friend" + scarcity reminder

---

## Next Steps After Welcome Email Works

### Option A: Resend Broadcasts (Manual for Beta)
For your beta launch, you could manually send follow-up broadcasts:
1. Export subscribers from Supabase
2. Create broadcast in Resend
3. Schedule and send to your audience
4. Good for testing messaging before automation

### Option B: Resend Automations (If Available in Your Plan)
1. Create automation workflows in Resend
2. Trigger: Contact added to audience
3. Delays: +2 days, +5 days, +7 days
4. Emails send automatically

### Option C: Custom Scheduled Function (Most Control)
Build a Netlify scheduled function that:
1. Runs daily (or hourly)
2. Queries Supabase for subscribers ready for next email
3. Sends via Resend API based on `drip_status` and `drip_sent_at`
4. Updates subscriber record after sending

---

## Environment Variables Checklist

- [ ] RESEND_API_KEY added to Netlify
- [ ] RESEND_FROM_EMAIL added to Netlify
- [ ] SNAP2CAL_APP_URL added to Netlify (if needed)
- [ ] Netlify site redeployed after adding variables
- [ ] Variables verified in Netlify dashboard

## Testing Checklist

- [ ] Domain verified in Resend (if using custom domain)
- [ ] Test signup completed on landing page
- [ ] Welcome email received with 3 codes
- [ ] CTA button links to correct app URL with code
- [ ] Code validates in app invite gate
- [ ] Subscriber appears in Supabase `subscribers` table
- [ ] 3 codes appear in Supabase `invite_codes` table
- [ ] Netlify function logs show no errors
- [ ] Resend dashboard shows successful delivery

---

## Support Resources

**Resend Documentation:**
- https://resend.com/docs/introduction
- https://resend.com/docs/send-with-nodejs
- https://resend.com/docs/dashboard/domains/introduction

**If Something Goes Wrong:**
1. Check Netlify function logs for error messages
2. Check Resend dashboard for delivery status
3. Verify environment variables are set correctly
4. Ensure domain is verified (if using custom domain)
5. Test with a simple curl command to isolate the issue

---

## Quick Reference: Your Current Setup

**Files Involved:**
- `netlify/functions/subscribe.js` - Contains Resend integration
- `landing.html` - Signup form
- `supabase/migrations/20260131000000_add_subscribers_and_invite_codes.sql` - Database schema

**Resend Integration Location:**
Lines 107-151 in `subscribe.js`

**What Happens on Signup:**
1. User submits email on landing page
2. `subscribe.js` function runs
3. Creates subscriber in Supabase
4. Generates 3 unique invite codes
5. If `RESEND_API_KEY` exists, sends welcome email
6. Returns codes to display on landing page

---

Good luck with the setup! 🚀

Once the welcome email is working, let me know and we can tackle the drip sequence next.
