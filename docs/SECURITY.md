# Security model

- OpenAI API key stays server-side (Cloudflare Worker secret).
- iPhone Shortcut authenticates using a shared secret header:
  `X-Drive-Token: <token>`

Recommendations:
- Use a long random token (32+ chars).
- Rotate token if exposed.
- Consider adding rate limiting if you make the endpoint publicly reachable.

## Azure OpenAI
If you use Azure OpenAI, store `AZURE_OPENAI_API_KEY` as a Worker secret (do not embed it in Shortcuts).

## Prevent key exposure

1) Keep API keys as Worker secrets only:
- `OPENAI_API_KEY` or `AZURE_OPENAI_API_KEY`
- Do not put keys in Shortcuts, `wrangler.toml`, or committed files.

2) Use a separate client auth token:
- `DRIVE_ASSISTANT_TOKEN` is sent from Shortcuts as `X-Drive-Token`
- Treat it like a password; rotate if exposed.

3) Do not echo upstream error bodies:
- This repo intentionally avoids returning or logging provider error bodies to reduce accidental leakage.

4) Add rate limiting:
- See `docs/RATE_LIMITING.md`

