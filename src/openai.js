import { extractFirstOutputText, safeJsonParse } from "./util.js";

/**
 * LLM provider abstraction for:
 * - OpenAI (api.openai.com)
 * - Azure OpenAI (Foundry Models) v1 APIs
 *
 * Azure v1 APIs are intended to align with OpenAI client semantics and use a base URL like:
 *   https://<resource>.openai.azure.com/openai/v1/
 * Azure key-based auth uses the `api-key` header. citeturn1view1turn1view3
 */

function getProvider(env) {
  const p = (env.LLM_PROVIDER || "openai").toString().toLowerCase();
  if (p === "azure" || p === "azure_openai" || p === "aoai") return "azure_openai";
  return "openai";
}

function getModel(env, provider) {
  if (provider === "azure_openai") {
    return (env.AZURE_OPENAI_MODEL || env.OPENAI_MODEL || "gpt-4o-mini").toString();
  }
  return (env.OPENAI_MODEL || "gpt-4o-mini").toString();
}

function getBaseUrl(env, provider) {
  if (provider === "azure_openai") {
    const ep = (env.AZURE_OPENAI_ENDPOINT || "").toString().replace(/\/+$/, "");
    if (!ep) throw new Error("Missing AZURE_OPENAI_ENDPOINT.");
    // Azure v1 data-plane base path:
    return `${ep}/openai/v1`;
  }
  return "https://api.openai.com/v1";
}

function buildHeaders(env, provider) {
  if (provider === "azure_openai") {
    const key = env.AZURE_OPENAI_API_KEY;
    if (!key) throw new Error("Missing AZURE_OPENAI_API_KEY.");
    return {
      "Content-Type": "application/json",
      "api-key": key
    };
  }

  const key = env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY.");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${key}`
  };
}

/**
 * Create the navigation/music execution plan using Responses API + Structured Outputs (JSON Schema strict).
 * Structured Outputs ensures the backend returns a predictable plan. citeturn0search3turn1view2
 */
export async function createPlanWithOpenAI({ env, mode, utterance, ctx }) {
  const provider = getProvider(env);
  const model = getModel(env, provider);
  const baseUrl = getBaseUrl(env, provider);
  const headers = buildHeaders(env, provider);

  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      needs_clarification: { type: "boolean" },
      spoken_summary: { type: "string" },
      navigation: {
        type: "object",
        additionalProperties: false,
        properties: {
          provider: { type: "string", enum: ["auto", "apple", "google", "waze"] },
          destination: { type: "string" },
          stops: { type: "array", items: { type: "string" } },
          travel_mode: { type: "string", enum: ["driving", "walking", "transit"] }
        },
        required: ["provider", "destination", "stops", "travel_mode"]
      },
      music: {
        type: "object",
        additionalProperties: false,
        properties: {
          intent: { type: "string", enum: ["none", "song", "artist", "album"] },
          query: { type: "string" }
        },
        required: ["intent", "query"]
      }
    },
    required: ["needs_clarification", "spoken_summary", "navigation", "music"]
  };

  const instructions =
`You are an in-car planner for iPhone Shortcuts.

Return STRICT JSON matching the schema.

Rules:
- If the user explicitly says "in Waze" / "in Google Maps" / "in Apple Maps", set navigation.provider accordingly.
- Otherwise navigation.provider="auto".
- travel_mode defaults to driving unless user asks to walk or transit.
- stops: include intermediate stops in order (empty array if none).
- If there are 2+ stops, prefer provider "google" in auto mode.
- If mode is "nav", set music.intent="none" and music.query="".
- If ambiguous (e.g., no destination), set needs_clarification=true with ONE concise spoken question.
- spoken_summary must be short and safe to speak while driving.`;

  const input = [
    { role: "system", content: instructions },
    { role: "user", content: `Mode: ${mode}\nContext: ${JSON.stringify(ctx)}\nRequest: ${utterance}` }
  ];

  const res = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      input,
      store: false,
      text: {
        format: {
          type: "json_schema",
          name: "carplay_plan",
          strict: true,
          schema
        }
      },
      max_output_tokens: 350
    })
  });

  if (!res.ok) {
    throw new Error(`${provider} error ${res.status}`);
  }

  const data = await res.json();
  const outText = extractFirstOutputText(data);
  const plan = safeJsonParse(outText);

  if (mode === "nav") {
    plan.music = { intent: "none", query: "" };
  }

  return plan;
}
