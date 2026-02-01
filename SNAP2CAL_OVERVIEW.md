# Snap2Cal - App Overview

## What Is Snap2Cal?

Snap2Cal is an AI-powered web application that transforms images of event flyers, schedules, and invitations into Google Calendar events with a single click. The app eliminates the tedious manual entry of event details by using computer vision to extract dates, times, locations, and event titles from photos.

**Tagline:** *One Snap. Zero Mental Load.*

## Target Audience

Snap2Cal is designed for busy parents and professionals who frequently encounter event information in visual formats:

- School newsletters and flyers
- Sports schedules
- Party invitations
- Community event posters
- Meeting screenshots

## Core Features

### AI-Powered Event Extraction
- Upload an image (PNG, JPG, GIF, WebP) or PDF
- Claude AI (Anthropic) analyzes the document and extracts all event details
- Handles multiple events from a single image
- Smart date interpretation (assumes current/next year based on context)

### Google Calendar Integration
- Secure OAuth 2.0 authentication
- Direct event creation to primary Google Calendar
- Individual "Add" buttons for each extracted event
- Edit links to modify events after adding

### Privacy-First Design
- No server-side storage of images or user data
- Images processed in real-time and immediately discarded
- OAuth tokens stored locally in browser only
- Write-only calendar access (cannot read/modify existing events)

## How It Works

1. **Sign In** - Connect your Google account via OAuth
2. **Upload** - Drag and drop or click to upload an image
3. **AI Processing** - Claude AI extracts event information
4. **Review** - Preview extracted events with dates, times, and locations
5. **Add** - Click to add individual events to your calendar

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vanilla JavaScript, HTML5, CSS3 |
| UI Framework | Custom CSS (mobile-responsive) |
| AI Engine | Anthropic Claude API (claude-sonnet-4) |
| Calendar API | Google Calendar API v3 |
| Authentication | Google OAuth 2.0 (Authorization Code Flow) |
| Hosting | Netlify (static site + serverless functions) |
| Backend Functions | Node.js (Netlify Functions) |

## Architecture

```
User Browser                    Netlify                     External APIs
    |                              |                              |
    |  [Upload Image]              |                              |
    |----------------------------->|                              |
    |                              |  [parse-pdf function]        |
    |                              |----------------------------->|
    |                              |       Anthropic Claude API   |
    |                              |<-----------------------------|
    |  [Extracted Events JSON]     |                              |
    |<-----------------------------|                              |
    |                              |                              |
    |  [Add Event Request]         |                              |
    |------------------------------------------------------->     |
    |                              |       Google Calendar API    |
    |<-------------------------------------------------------|    |
    |  [Event Created]             |                              |
```

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main application (single-page app) |
| `privacy.html` | Privacy Policy page |
| `terms.html` | Terms of Service page |
| `faq.html` | Frequently Asked Questions |
| `netlify/functions/parse-pdf.js` | Claude API integration for image analysis |
| `netlify/functions/exchange-code.js` | OAuth token exchange |
| `netlify/functions/refresh-token.js` | OAuth token refresh |
| `analytics.js` | Usage analytics |
| `email-capture.js` | Newsletter subscription handling |

## Current Limitations

- Events added to primary calendar only (no calendar selection)
- No event editing before adding
- Image-based PDFs work better than text PDFs
- Single image upload at a time (no batch processing)

## Roadmap (v2.0)

- Native iOS app for App Store
- Event editing interface before adding
- Multiple calendar selection
- Recurring event detection
- Batch file upload
- Time zone selection
- Event color coding

## Business Information

| Item | Value |
|------|-------|
| Company | AmandaMade Digital Studio |
| Creator | Amanda Worsfold |
| Contact | hello@snap2cal.ai |
| Status | Beta (Free) |
| Copyright | 2025-2026 |

## Related Documentation

- [Branding Guidelines](./BRANDING_GUIDELINES.md)
- [Privacy Policy](./privacy.html)
- [Terms of Service](./terms.html)
- [FAQ](./faq.html)
