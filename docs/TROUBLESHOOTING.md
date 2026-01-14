# Troubleshooting

## Unauthorized
Your Shortcut header `X-Drive-Token` does not match the Worker secret.

## Missing utterance
Dictate Text returned empty. Re-run and speak clearly.

## Music opens but doesn't auto-play
iOS sometimes opens to the item page; auto-play depends on state. You can add a Play/Pause action in the Shortcut after Open URL if desired.

## Multi-stop routes
Multi-stop (stops array) will prefer Google Maps (supports waypoints in the URL).
