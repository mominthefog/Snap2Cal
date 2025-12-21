## Snap2Cal — Copilot / AI Agent Instructions

This repo is a small single-page web app (static frontend) with a minimal Netlify Functions backend used to extract events from PDFs/images using OpenAI and add them to Google Calendar.

Key files and locations
- `index.html` — single-page frontend; includes Google OAuth button, client-side upload, and fetch calls to the backend function.
- `netlify/functions/parse-pdf.js` — server-side Netlify function that calls OpenAI and returns a JSON array of Google Calendar events.
- `netlify.toml` — Netlify build settings; `functions` points at `netlify/functions` and `publish='.'` (site is served from repo root).
- `package.json` — declares `node-fetch` dependency for functions.
- `README.md`, `GITHUB_SETUP.md` — developer-facing docs with run instructions and OAuth notes.

Big-picture architecture and rationale
- Frontend: Static HTML/JS (no build step). The UI lives in `index.html` and runs in the browser (served from repo root).
- Backend: Lightweight serverless functions (Netlify Functions). Complex or secret-bearing work (OpenAI calls) is implemented in `parse-pdf.js` and expects `process.env.OPENAI_API_KEY` to be configured in the environment.
- Why this structure: keeps the UI simple and portable (can be served by GitHub Pages or Netlify), while allowing private keys to be used securely in serverless functions.

Important, discoverable conventions and patterns
- Event schema: the function returns an `events` array where each element is a Google Calendar event object with at minimum `title`/`summary` and `start`/`end` objects (use ISO `dateTime` fields). See `parse-pdf.js` system prompt for the explicit schema.
- Payload format to functions: frontend sends `{ fileContent: <dataUrl/base64>, fileName: <string> }` in a JSON POST to `/.netlify/functions/parse-pdf`.
- Auth: Google access token (OAuth) is obtained in the browser; the token is stored in `localStorage` and used directly by the client when calling Google Calendar APIs.

Observed inconsistencies you should preserve or verify
- README.md claims "Your OpenAI API key is stored locally in your browser" (client-side). However, current `parse-pdf.js` expects a server-side `OPENAI_API_KEY` environment variable and performs the OpenAI call server-side. When editing behavior, confirm whether calls should be client-side or server-side and update both code and README consistently.

Developer workflows (how to run & debug locally)
- Static frontend only: from project root run:
  ```bash
  python3 -m http.server 8888
  # then open http://localhost:8888
  ```
- Netlify Functions locally (recommended to debug `parse-pdf`): install Netlify CLI and run with OPENAI key set:
  ```bash
  # install netlify cli if needed
  npm install -g netlify-cli
  export OPENAI_API_KEY="sk-..."
  netlify dev
  ```
- Alternatively, test the function directly with curl/postman against the deployed Netlify function URL; the function expects a POST JSON body `{ "fileContent": "data:...,", "fileName": "foo.pdf" }` and returns `{ events: [...] }`.

What to avoid changing without confirmation
- Do not commit API keys — the repo's `.gitignore` is intended to exclude secrets.
- Don't change the OAuth `CLIENT_ID` in `index.html` without confirming Google Cloud Console settings and redirect/origin entries (authorized origins include `http://localhost:8888`).

Quick examples for agents
- How to call the backend in code (from `index.html`):
  ```js
  fetch('/.netlify/functions/parse-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileContent: dataUrl, fileName: 'page1.png' })
  })
  ```
- Expected function response shape:
  ```json
  { "events": [ { "summary": "Event title", "start": {"dateTime":"2025-01-01T10:00:00Z"}, "end": {"dateTime":"2025-01-01T11:00:00Z"}, "description": "...", "location": "..." } ] }
  ```

Checks that an AI agent should perform before making edits
- Verify whether OpenAI calls are intended to be server-side (parse-pdf.js) or client-side (README statement). If you switch one to the other, update `README.md` and ensure secrets are handled appropriately.
- Confirm Netlify function runtime and Node version compatibility if adding modern JS features; `package.json` is minimal and server code currently uses CommonJS.
- When editing event output format, keep compatibility with the event consumer code in `index.html` (it expects `start.dateTime` or `start.date`).

If anything here is unclear or you want me to include more concrete examples (tests, local Netlify dev setup, or a small example request/response), tell me which area to expand and I'll iterate.
