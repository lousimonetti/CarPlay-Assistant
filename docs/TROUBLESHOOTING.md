# Troubleshooting

## Unauthorized
Your Shortcut header `X-Drive-Token` does not match the Worker secret.

## Missing utterance
Dictate Text returned empty. Re-run and speak clearly.

## Music opens but doesn't auto-play
iOS sometimes opens to the item page; auto-play depends on state. You can add a Play/Pause action in the Shortcut after Open URL if desired.

## Multi-stop routes
Multi-stop (stops array) will prefer Google Maps (supports waypoints in the URL).

## Azure OpenAI: Responses API not available
If Azure returns a 404/unsupported error, confirm your resource region supports the Responses API and that you are using the v1 base URL (`/openai/v1/`).

## 429 Rate limit exceeded
Your token hit the configured rate limit. Reduce retry loops or increase `simple.limit` in `wrangler.toml`.

