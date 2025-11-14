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

## Getting Started

### Prerequisites

- A Google account
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Setup

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **Sign in** with Google
4. **Enter your OpenAI API key** (stored locally in your browser)
5. **Start uploading** documents!

### Local Development

No build process required! This is a standalone HTML file that runs entirely in the browser.

To run locally:
```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Use a local server (recommended for development)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Google Cloud Console Setup

To use this app, you'll need to configure Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**
4. Create **OAuth 2.0 credentials** (Web application)
5. Add authorized JavaScript origins (e.g., `http://localhost:8000`)
6. Update the `GOOGLE_CLIENT_ID` in `index.html` with your Client ID

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

## Future Enhancements

- [ ] Event editing interface
- [ ] Multiple calendar selection
- [ ] Recurring event detection
- [ ] Batch file upload
- [ ] Switch to Anthropic API for better PDF handling
- [ ] Time zone selection
- [ ] Event color coding

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues or questions:
- **Google Calendar API**: [Documentation](https://developers.google.com/calendar/api)
- **OpenAI API**: [Documentation](https://platform.openai.com/docs)

---

Built with ❤️ using AI-powered document processing
