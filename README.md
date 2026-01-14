# CarPlay Drive Assistant (Siri Shortcut + OpenAI Planner)

This repository provides a small, secure backend for two Siri/CarPlay Shortcuts:

- **Drive Assistant**: navigation + Apple Music
- **Navigate Assistant**: navigation only

You trigger the Shortcut by voice in CarPlay (Siri is the microphone trigger), dictate one request, and the Shortcut executes a plan returned by the backend.

## Why a backend?
Do **not** embed your OpenAI API key in an iOS Shortcut. Keep the key server-side, and authenticate your phone with a shared secret header.

## Endpoints
- `POST /plan/nav`
- `POST /plan/drive`
Both require header: `X-Drive-Token: <DRIVE_ASSISTANT_TOKEN>`

Payload example:
```json
{
  "utterance": "Take me to Starbucks and play Metallica",
  "lat": 42.33,
  "lon": -83.05,
  "country": "US",
  "locale": "en-US",
  "nav_preference": "auto"
}
```

## Deploy (Cloudflare Worker)
```bash
npm i
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put DRIVE_ASSISTANT_TOKEN
npm run deploy
```

## Build the Shortcuts
See: `docs/SHORTCUTS.md`

## Dev
```bash
npm run dev
npm test
```
