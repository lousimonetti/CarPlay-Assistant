import { extractFirstOutputText, safeJsonParse } from "./util.js";

/**
 * OpenAI Responses API + Structured Outputs (JSON Schema strict).
 * This lets the backend return a predictable execution plan.
 */
export async function createPlanWithOpenAI({ apiKey, mode, utterance, ctx }) {
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY.");

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

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
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
    const t = await res.text().catch(() => "");
    throw new Error(`OpenAI error ${res.status}: ${t}`);
  }

  const data = await res.json();
  const outText = extractFirstOutputText(data);
  const plan = safeJsonParse(outText);

  if (mode === "nav") {
    plan.music = { intent: "none", query: "" };
  }

  return plan;
}
