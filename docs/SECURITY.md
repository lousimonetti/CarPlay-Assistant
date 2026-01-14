# Security model

- OpenAI API key stays server-side (Cloudflare Worker secret).
- iPhone Shortcut authenticates using a shared secret header:
  `X-Drive-Token: <token>`

Recommendations:
- Use a long random token (32+ chars).
- Rotate token if exposed.
- Consider adding rate limiting if you make the endpoint publicly reachable.
