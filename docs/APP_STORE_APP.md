# Building an App Store app for this assistant (optional)

This repo currently uses iOS Shortcuts to call a server-side Worker.

If you want a deployable package via the App Store, the correct approach is an iOS app that exposes actions via:

- **App Intents**
- **App Shortcuts**

Apple’s platform guidance highlights App Intents and App Shortcuts for making actions available in Siri and Shortcuts without requiring the user to manually build a shortcut. citeturn1search9turn0search4turn0search6turn1search17

## What the app would include

1) Settings UI
- Worker base URL
- Client token (X-Drive-Token)
- Preferred nav provider
Store in Keychain.

2) Two App Intents
- DriveAssistantIntent: returns nav_url + music_url, opens URLs
- NavigateAssistantIntent: returns nav_url, opens URL

3) App Shortcuts phrases
Users can invoke via Siri and Shortcuts surfaces.

4) Privacy disclosures
If you transmit location and text off-device, you may need privacy disclosures and App Store review alignment.

## Why not ship a Shortcut alone?
Shortcuts can be shared via iCloud links or files, but App Store distribution is centered on apps. The app provides the stable “action surface” via App Intents.
