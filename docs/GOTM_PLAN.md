# Snap2Cal Go-to-Market Plan

## Target Personas

### Primary: Busy parents
- Manage family calendars (school events, sports, parties)
- Frequently receive event info as flyers, screenshots, newsletters
- Want to reduce manual entry and mental load
- Value simplicity and speed

### Secondary: Professionals
- Handle meeting invites, conference schedules, event PDFs
- Use Google Calendar for work and personal
- Want one-tap capture of event details

---

## Messaging and Positioning

**Tagline:** One Snap. Zero Mental Load.

**Value proposition:** Transform event flyers, schedules, and invitations into Google Calendar events in seconds. Built for busy parents and professionals who are tired of typing event details by hand.

**Key messages:**
- "Transform event flyers into calendar events in seconds"
- "Built for busy parents and professionals"
- "Free during beta — join the waitlist"
- "AI extracts the details. You add them with one click."

---

## Launch Phases

### Phase 1: Friends and family
- Invite 20–50 people with direct codes
- Gather feedback on UX, edge cases, and messaging
- Refine the invite flow and app gate

### Phase 2: Wider beta
- Open waitlist via landing page (snap2cal.ai)
- 3 codes per signup for viral sharing
- Monitor signups, code usage, and retention

### Phase 3: Pre-monetization
- Create demand and scarcity with limited codes
- Test pricing and packaging with beta users
- Prepare App Store listing and TestFlight

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Landing signups | Track in Supabase `subscribers` |
| Code usage rate | Codes used / codes allocated |
| App sign-ins | Track in Supabase `users` |
| Retention | Weekly active users after first sign-in |

---

## Email Drip Content

### Email 1 (Immediate — Welcome)
**Subject:** Your Snap2Cal beta invite codes are ready

**Body:**
Thanks for joining the Snap2Cal beta!

Here are your 3 invite codes:
- {{invite_code_1}}
- {{invite_code_2}}
- {{invite_code_3}}

Use one yourself and share the rest with friends.

[Use a code and open Snap2Cal]({{referral_link}})

One Snap. Zero Mental Load.

---

### Email 2 (+2 days)
**Subject:** Try Snap2Cal today

**Body:**
Hey {{first_name}},

Snap2Cal is ready when you are. Snap a photo of any event flyer or schedule, and we’ll add the details to your Google Calendar in seconds.

Perfect for:
- School newsletters and sports schedules
- Party invitations
- Meeting screenshots

[Open Snap2Cal]({{app_link}})

---

### Email 3 (+5 days)
**Subject:** Pro tip: One image, multiple events

**Body:**
Did you know? Snap2Cal can extract multiple events from a single image. A whole month of sports games, a weekly schedule, or a conference program — we’ve got it.

Share your extra codes with friends who’d love this. They’ll thank you.

[Open Snap2Cal]({{app_link}})

---

### Email 4 (+7 days)
**Subject:** Share Snap2Cal with a friend

**Body:**
Beta spots are limited. If you haven’t used your codes yet, now’s the time. Share one with a friend who’s always juggling family calendars or event PDFs.

[Open Snap2Cal]({{app_link}})

---

## Landing Copy

### Hero
**Headline:** One Snap. Zero Mental Load.  
**Subhead:** Transform event flyers into calendar events in seconds  
**Tagline:** Built for busy parents and professionals

### Scarcity
"Limited beta — Join the waitlist to get your invite codes and be first to try Snap2Cal."

### CTA
"Join the beta" (primary)  
"Get one at Snap2Cal" (for users who need a code on the app)  
"Use a code and open Snap2Cal" (after signup)

### Have a code
"Already have a code? Open the app"

---

## Promo Ideas for Landing

- "Transform event flyers into calendar events in seconds"
- "Built for busy parents and professionals"
- "Free during beta — join the waitlist"
- "Snap a flyer. Add to calendar. Done."
- "No more typing event details by hand"
- "AI-powered calendar capture"

---

## Resend Setup for Email Drip

1. Create a Resend account at resend.com
2. Verify your sending domain (e.g. snap2cal.ai)
3. Create an API key and add to Netlify env:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (e.g. `Snap2Cal <hello@snap2cal.ai>`)
4. Optional: `SNAP2CAL_APP_URL` for correct links (default: `https://app.snap2cal.ai`)

The subscribe flow sends:
- **Immediate:** Welcome email with invite codes (built-in)
- **Follow-up:** Set up a Broadcast sequence or automation in Resend for Emails 2–4 using the copy above

---

## Domain Setup Checklist

- [ ] Add `snap2cal.ai` as primary domain in Netlify
- [ ] Add `app.snap2cal.ai` as domain alias
- [ ] Add `www.snap2cal.ai` redirect to `snap2cal.ai` (optional)
- [ ] Verify DNS for custom domain
