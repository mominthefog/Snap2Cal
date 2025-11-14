# Snap2Cal

**Convert PDFs and images to Google Calendar events instantly**

Snap2Cal is a web application that uses AI to extract calendar events from PDF documents and images, then seamlessly adds them to your Google Calendar.

## Features

✅ Google OAuth authentication  
✅ PDF and image upload support (PNG, JPG, GIF, WebP)  
✅ AI-powered event extraction using OpenAI  
✅ Event preview and review before adding  
✅ Direct integration with Google Calendar  
✅ Clean, modern UI with real-time status updates  

## How It Works

1. **Sign in** with your Google account
2. **Upload** a PDF or image containing event information
3. **AI extracts** event details (title, date, time, location, description)
4. **Review** the parsed events
5. **Confirm** to add all events to your Google Calendar

## Development Setup

### Prerequisites

- A Google account
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Google Cloud Console project with Calendar API enabled

### Local Development

1. **Clone this repository**
   ```bash
   git clone https://github.com/mominthefog/Snap2Cal.git
   cd Snap2Cal
   ```

2. **Configure Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select your project
   - Enable **Google Calendar API**
   - Create **OAuth 2.0 Client ID** (Web application)
   - Add authorized JavaScript origins:
     - `http://localhost:8000`
     - `http://127.0.0.1:8000`
   - Copy your Client ID and update it in `index.html` (line 72)

3. **Run locally**
   ```bash
   python3 -m http.server 8000
   ```
   Then visit: `http://localhost:8000`

4. **Get your OpenAI API key**
   - Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Enter it in the app (stored locally in your browser)

## Tech Stack

- **React** (via CDN) - Frontend framework
- **Tailwind CSS** (via CDN) - Styling
- **OpenAI API** - Document analysis and event extraction
- **Google Calendar API** - Calendar integration
- **Google OAuth 2.0** - Authentication

## Privacy & Security

- Your OpenAI API key is stored **locally** in your browser
- It is **never** sent to any server except OpenAI
- Google authentication uses **OAuth 2.0** standard security
- No backend server - runs entirely in your browser

## Current Limitations

- OpenAI works best with image-based PDFs
- For text-heavy PDFs, consider converting pages to images first
- Events are added to your primary calendar only
- No event editing before adding to calendar (planned for v2)

## Roadmap

### Version 2.0
- [ ] Native iOS app for App Store distribution
- [ ] Switch to Anthropic API for better PDF handling
- [ ] Event editing interface
- [ ] Multiple calendar selection
- [ ] Recurring event detection
- [ ] Batch file upload
- [ ] Time zone selection
- [ ] Event color coding

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
Make sure your Google Cloud Console authorized JavaScript origins match the URL you're accessing the app from (e.g., `http://localhost:8000`).

### "Access blocked: This app's request is invalid"
Your redirect URIs in Google Cloud Console don't match. Double-check both the port number and protocol (http://).

### Events not parsing correctly
OpenAI performs best with image-based PDFs. If you have a text PDF with poor results, try:
1. Converting pages to images first
2. Ensuring dates are in a clear format (MM/DD/YYYY)
3. Checking that event information is visually distinct

## License

Copyright © 2025 Amanda Worsfold. All rights reserved.

This code is provided for portfolio and demonstration purposes. Commercial use, distribution, or reproduction without explicit permission is prohibited.

## Contact

For questions or collaboration inquiries, please reach out via GitHub.

---

*Snap2Cal is currently in development. App Store release coming soon.*
