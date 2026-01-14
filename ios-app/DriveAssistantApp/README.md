# DriveAssistantApp (App Store–deployable quick win)

This is a minimal SwiftUI iOS app that exposes two **App Shortcuts** via **App Intents**:

- "Drive Assistant" (navigation + music)
- "Navigate Assistant" (navigation only)

The shortcuts call your deployed Worker (`/plan/drive` and `/plan/nav`) and then the app opens the resulting URLs for Maps and Apple Music.

## Important constraints
- iOS will still use Siri as the voice trigger.
- App Shortcuts are provided by the app automatically; users do not need to manually build Shortcuts.
- To open Maps/Music reliably, this app stores the planned URLs as a **pending plan**, then executes them when the app is opened by the shortcut.

## Quick start (Xcode)
1) Open Xcode → File → New → Project → iOS → App (SwiftUI).
2) Name it `DriveAssistantApp` (or any name).
3) Set the bundle identifier (e.g., `com.yourname.driveassistant`).
4) Replace the generated `ContentView.swift` and `<AppName>App.swift` with the files in `Sources/`.
5) Add the `Sources/Intents/*.swift` files to your target.
6) Add the `Resources/AppShortcuts.strings` to your target (optional; phrases localization).
7) Build + run once on device.

## Configure the backend in the app
Open the app → Settings tab:
- Worker Base URL (e.g., `https://<your-worker>.workers.dev`)
- Shortcut Token (same as `DRIVE_ASSISTANT_TOKEN`)
- Default nav provider: auto / apple / google / waze

Then try:
- “Hey Siri, Drive Assistant”
- “Hey Siri, Navigate Assistant”

## App Store notes
- You’ll need an Apple Developer Program account to ship to the App Store/TestFlight.
- If you transmit user text/location off-device, ensure privacy disclosures align with App Store review.

## Security notes
- The app stores your token in Keychain (not in plain UserDefaults).
- Your OpenAI/Azure API keys remain server-side in Cloudflare Worker secrets.
