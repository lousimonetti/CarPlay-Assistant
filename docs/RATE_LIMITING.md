# Rate limiting

This backend protects your OpenAI/Azure spend by limiting how often a Shortcut token can call the `/plan/*` endpoints.

## Option A: Worker-side Rate Limiting API (recommended)

This repo ships with an optional `[[ratelimits]]` binding in `wrangler.toml` named `DRIVE_RATE_LIMITER`.

- The Worker enforces rate limits by calling:
  `await env.DRIVE_RATE_LIMITER.limit({ key })`
- The key is derived from your Shortcut token and route (per-token/per-route throttling).
- Requires Wrangler CLI 4.36.0+.

Tune values in `wrangler.toml` (default in this repo is **10 commands per minute**):
- `simple.limit` (requests)
- `simple.period` (10 or 60 seconds)

Note: Rate limits are local to a Cloudflare location. They are designed for abuse mitigation, not precise accounting.

## Option B: WAF Rate Limiting Rules (dashboard)

You can also create a WAF rate limiting rule in Cloudflare’s dashboard to match:
- URI Path starts with `/plan/`
- Method equals `POST`

Then set a threshold (e.g., 30 requests per 1 minute) and action (Block/Challenge).
