# CarPlay Drive Assistant (Siri Shortcut + OpenAI Planner)

This repository provides a small, secure backend for two Siri/CarPlay Shortcuts:

- **Drive Assistant**: navigation + Apple Music
- **Navigate Assistant**: navigation only

You trigger the Shortcut by voice in CarPlay (Siri is the microphone trigger), dictate one request, and the Shortcut executes a plan returned by the backend.

## Why a backend?
Do **not** embed your OpenAI API key in an iOS Shortcut. Keep the key server-side, and authenticate your phone with a shared secret header.


## Azure OpenAI option (Foundry Models)

This backend can call either:
- **OpenAI** (`https://api.openai.com/v1/responses`)
- **Azure OpenAI** using the **v1** data-plane APIs (`https://<resource>.openai.azure.com/openai/v1/responses`).

Azure’s next-generation **v1** APIs are designed to be largely compatible with the OpenAI client and remove the need to specify `api-version` on every request. citeturn1view3turn1view1

### Configure Azure OpenAI
1) Set Wrangler vars (in `wrangler.toml` or via the Cloudflare dashboard):
- `LLM_PROVIDER="azure_openai"`
- `AZURE_OPENAI_ENDPOINT="https://<your-resource-name>.openai.azure.com"`
- `AZURE_OPENAI_MODEL="<your-deployment-name>"` (Azure uses your **deployment name** as `model` in v1 examples). citeturn1view3turn1view1

2) Set the Azure API key as a Worker secret:
```bash
npx wrangler secret put AZURE_OPENAI_API_KEY
```

Azure supports API-key auth via the `api-key` header (and also supports Microsoft Entra ID auth). citeturn1view1

### Notes
- The Azure **Responses API** is region-scoped. Ensure your Azure OpenAI resource is in a region where the Responses API is available. citeturn1view0

## Endpoints
- `POST /plan/nav`
- `POST /plan/drive`
Both require header: `X-Drive-Token: <DRIVE_ASSISTANT_TOKEN>`

Payload example:
```json
{
  "utterance": "Take me to Starbucks and play Metallica",
  "lat": 42.33,
  "lon": -83.05,
  "country": "US",
  "locale": "en-US",
  "nav_preference": "auto"
}
```

## Deploy (Cloudflare Worker)
```bash
npm i
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put DRIVE_ASSISTANT_TOKEN
npm run deploy
```

## Build the Shortcuts
See: `docs/SHORTCUTS.md`



## Rate limiting (recommended)

To protect your OpenAI/Azure spend, enable rate limiting:
- Worker-side rate limiting binding (`[[ratelimits]]`) is included in `wrangler.toml` and enforced automatically when present.
- See `docs/RATE_LIMITING.md` for tuning and WAF rule alternatives.

## Deploy to Cloudflare Workers (Wrangler)

### Is it free?
Cloudflare Workers has a free tier (Workers Free). For personal use, this is typically sufficient. Note that OpenAI API usage is billed separately by OpenAI.

### Prerequisites
- Cloudflare account
- Node.js installed
- Wrangler CLI (this repo uses `npx wrangler`, so no global install is required)

### Install
```bash
npm install
```

### Authenticate Wrangler
```bash
npx wrangler login
```

### Set required secrets
Set these as **Worker secrets** (recommended; do not commit them to source control):
```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put DRIVE_ASSISTANT_TOKEN
```

### Deploy
```bash
npm run deploy
# or: npx wrangler deploy
```

Wrangler will output your Worker URL (usually a `workers.dev` domain). Use it in your Shortcuts:
- `https://<your-worker>/plan/drive`
- `https://<your-worker>/plan/nav`

### Health check
After deploy, verify:
- `https://<your-worker>/health`

You should get a small JSON response like `{ "ok": true, ... }`.

## Dev
```bash
npm run dev
npm test
```

