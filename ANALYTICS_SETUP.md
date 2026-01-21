# Snap2Cal Email Capture & Analytics Setup

This setup provides both **marketing intelligence** (email capture for product updates) and **user intelligence** (analytics to track how many users you have).

## What's Included

### 1. Email Capture Form
- **Location**: Homepage (`index.html`)
- **Purpose**: Collect email addresses for Snap2Cal product updates
- **Data Storage**: Emails are stored in browser localStorage (and can be sent to your backend API)

### 2. Analytics Tracking
- **File**: `analytics.js`
- **Purpose**: Track unique users, sessions, and page views
- **Data Collected**:
  - Unique user IDs (stored in localStorage)
  - Session tracking
  - Page views and navigation patterns
  - User agent, screen size, referrer information

### 3. Admin Dashboard
- **File**: `admin.html`
- **Purpose**: View analytics and user intelligence
- **Features**:
  - Unique user count
  - Email captures count
  - Page views tracking
  - Session counts
  - Email list with export to CSV
  - Recent activity log

## How to Use

### View Analytics
1. Open `admin.html` in your browser (or visit `/admin.html` on your deployed site)
2. View real-time stats:
   - Unique users count
   - Email captures
   - Page views
   - Sessions
3. Export email list as CSV

### Test Email Capture
1. Visit your Snap2Cal homepage
2. Scroll to the email capture form
3. Enter an email and click "Subscribe"
4. Check `admin.html` to see the email appear in the list

## Setting Up a Backend (Optional but Recommended)

Currently, the system stores data in browser localStorage. For production use, you'll want to set up a backend API.

### Update Configuration

Edit `analytics.js` and update the `CONFIG` object:

```javascript
const CONFIG = {
    EMAIL_API_ENDPOINT: 'https://your-api.com/snap2cal/subscribe',
    ANALYTICS_ENDPOINT: 'https://your-api.com/snap2cal/analytics',
    // ... rest of config
};
```

### Backend Service Options

You can use any of these services:

1. **Netlify Functions** - Since you're already on Netlify, create serverless functions
2. **Formspree** - Simple form backend (free tier available)
3. **Vercel Functions** - Serverless functions
4. **Google Sheets API** - Simple data storage
5. **Your own server** - Full control

## Using LocalStorage Data (No Backend)

If you're not ready to set up a backend, you can still:

1. **View data locally**: Open `admin.html` to see stats from localStorage
2. **Export emails**: Click "Export Email List (CSV)" to download all captured emails
3. **Access raw data**: Use browser DevTools → Application → Local Storage

To view localStorage data:
- Open DevTools (F12 or Cmd+Option+I)
- Go to Application tab
- Click "Local Storage"
- Look for keys:
  - `snap2cal_user_id` - Current user ID
  - `snap2cal_emails` - Array of captured emails
  - `snap2cal_analytics` - Array of page views/analytics events

## Files Added

- `analytics.js` - User tracking and analytics
- `email-capture.js` - Email form handling
- `admin.html` - Analytics dashboard

## Testing Locally

1. Open your Snap2Cal site locally
2. Test the email capture form
3. Visit `admin.html` to see the analytics dashboard
4. Export emails as CSV to verify functionality

## Next Steps

1. **Set up backend API** (recommended for production) - You can use Netlify Functions since you're already on Netlify
2. **Add email service integration** (e.g., Mailchimp, ConvertKit, SendGrid)
3. **Deploy to Netlify** - The analytics will work immediately
4. **Access admin dashboard** - Visit `https://your-site.netlify.app/admin.html` after deployment
