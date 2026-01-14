# iPhone setup & Shortcuts build guide (CarPlay-friendly)

This document is a practical, step-by-step guide for building the two Shortcuts that call this assistant:

- **Drive Assistant** (navigation + Apple Music)
- **Navigate Assistant** (navigation only)

It also explains how to distribute your Shortcut(s) and what would be required to ship an App Store app instead.

---

## 0) Prerequisites

### On the backend (once)
1. Deploy the Cloudflare Worker (see README).
2. Note your Worker base URL, e.g.:
   - `https://<your-worker>.workers.dev`
3. Set (and **record**) your client token:
   - `DRIVE_ASSISTANT_TOKEN` (Worker secret)

### On the iPhone (once)
1. Install the **Shortcuts** app (usually preinstalled).
2. Enable iCloud Sync for Shortcuts if you want the shortcuts on multiple Apple devices. Apple documents iCloud Sync for Shortcuts. citeturn0search9
3. If you will import a shared Shortcut from a link/file, you may need to enable:
   - iOS Settings → Shortcuts → **Allow Untrusted Shortcuts** (older behavior; may not be present in newer versions). Apple Community guidance notes this toggle appears after running a shortcut once. citeturn1search10

---

## 1) Build Shortcut: “Drive Assistant” (Nav + Apple Music)

### Goal
Single Siri interaction in CarPlay:
- “Hey Siri, Drive Assistant”
- Dictate one request
- The shortcut calls `/plan/drive`, then opens navigation + music URLs.

### Steps
1) Open **Shortcuts** → **+** → **New Shortcut**
2) Name: **Drive Assistant**

#### A. Capture your request
3) Add action: **Dictate Text**
   - Prompt: “What do you want to do?”
   - Language: English (US)

#### B. Capture current location (optional but recommended)
4) Add action: **Get Current Location**
5) Add action: **Get Details of Locations** → **Latitude**
6) Add action: **Get Details of Locations** → **Longitude**

#### C. Build JSON payload (Text action)
7) Add action: **Text**
   Paste:

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

#### D. Call the Worker (Get Contents of URL)
8) Add action: **Get Contents of URL**
   - URL: `https://<your-worker>/plan/drive`
   - Tap **Show More**
   - Method: **POST**
   - Request Body: **JSON**
   - JSON: use the **Text** action output
   - Headers:
     - `Content-Type` = `application/json`
     - `X-Drive-Token` = `<your DRIVE_ASSISTANT_TOKEN>`

Apple’s Shortcuts guide documents using **Get Contents of URL** for API requests and selecting methods like POST. citeturn1search1

#### E. Parse response & execute
9) Add action: **Get Dictionary from Input**
10) Optional: Add action **Speak Text** using `spoken_summary`
11) Add action: **If** `nav_url` is not empty → **Open URL** → `nav_url`
12) Add action: **If** `music_url` is not empty → **Open URL** → `music_url`

Optional: add **Wait 1 second** between nav and music opens.

---

## 2) Build Shortcut: “Navigate Assistant” (Nav only)

Same as above, except:
- Endpoint: `https://<your-worker>/plan/nav`
- Only open `nav_url`

---

## 3) CarPlay usability improvements

### Add widgets / quick access
If your iOS version supports CarPlay widgets, add a Shortcuts widget stack for quick access:
- iOS Settings → General → CarPlay → (Your vehicle) → Widgets → Add Widgets (UI may vary by version). citeturn2view1

---

## 4) How to distribute these “actions” to others

### Option A: Share the Shortcut (recommended for personal/friends)
Apple supports sharing shortcuts via:
- **iCloud link**
- **file** export (e.g., `.shortcut`) citeturn0search0turn0search3

You can add **Import Questions** so recipients can enter configuration (worker URL/token) during import. Apple mentions import questions as a sharing feature. citeturn0search0

### Option B: Ship an App Store app (professional distribution)
You generally **can’t ship a Shortcut by itself** as an App Store product.

What you can ship is an iOS app that exposes actions to Shortcuts and Siri using:
- **App Intents**
- **App Shortcuts**

Apple’s developer docs and WWDC sessions cover App Intents / App Shortcuts and emphasize that App Shortcuts don’t require configuration. citeturn1search9turn0search4turn0search6turn1search17

---

## 5) Recommended import questions (if sharing)

- Worker Base URL
- Token (X-Drive-Token)
- Preferred nav provider (auto/apple/google/waze)

This avoids hardcoding secrets and enables per-device tokens.
