# Shortcuts setup (CarPlay / Siri)

These Shortcuts call your Worker using **Get Contents of URL** (POST + headers). This is the most reliable way to invoke your backend from Siri/CarPlay.

## Shortcut A: Drive Assistant (Nav + Apple Music)

1. Create a new Shortcut named **Drive Assistant**
2. Add **Dictate Text**
   - Prompt: “What do you want to do?”
3. Add **Get Current Location**
4. Add **Get Details of Locations** → Latitude
5. Add **Get Details of Locations** → Longitude
6. Add **Text** and build JSON:

```json
{
  "utterance": "[Dictated Text]",
  "lat": [Latitude],
  "lon": [Longitude],
  "country": "US",
  "locale": "en-US",
  "nav_preference": "auto"
}
```

7. Add **Get Contents of URL**
   - URL: `https://<your-worker-domain>/plan/drive`
   - Method: POST
   - Headers:
     - `Content-Type: application/json`
     - `X-Drive-Token: <your token>`
   - Request body: the JSON text from step 6

8. Add **Get Dictionary from Input**
9. (Optional) Add **Speak Text** using `spoken_summary`
10. If `nav_url` is not empty → **Open URL** → `nav_url`
11. If `music_url` is not empty → **Open URL** → `music_url`

Run in the car:
- “Hey Siri, Drive Assistant” then dictate.

## Shortcut B: Navigate Assistant (Nav only)

Same, but:
- URL: `https://<your-worker-domain>/plan/nav`
- Only open `nav_url`

For the full, detailed phone build guide (including headers, JSON body configuration, and distribution options), see `docs/PHONE_SETUP.md`.

