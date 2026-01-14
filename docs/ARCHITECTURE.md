# Architecture

Siri (CarPlay mic) → Shortcut → Backend → Shortcut executes URLs.

- Shortcut captures one dictation.
- Backend converts it to a strict JSON plan (OpenAI Structured Outputs with JSON Schema).
- Backend returns:
  - `nav_url` (Apple Maps / Google Maps / Waze)
  - optional `music_url` (Apple Music)
- Shortcut opens the URLs.

LLM provider can be OpenAI or Azure OpenAI (Foundry Models) v1 Responses API.

