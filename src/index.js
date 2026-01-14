import { json, readJson, nowIso } from "./util.js";
import { requireToken } from "./security.js";
import { createPlanWithOpenAI } from "./openai.js";
import { buildNavigationUrl } from "./maps.js";
import { resolveAppleMusicUrl } from "./music.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, ts: nowIso() }, 200);
    }

    const auth = requireToken(request, env);
    if (!auth.ok) return json({ error: auth.error }, auth.status);

    if (request.method !== "POST") {
      return json({ error: "Use POST." }, 405);
    }

// Basic request size guard (defense-in-depth; some clients may omit content-length)
const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
if (contentLength && contentLength > 8192) {
  return json({ error: "Payload too large." }, 413);
}


    const mode =
      url.pathname === "/plan/drive" ? "drive" :
      url.pathname === "/plan/nav" ? "nav" :
      null;

    if (!mode) return json({ error: "Not found." }, 404);

// Optional rate limiting (requires [[ratelimits]] binding in wrangler.toml)
// Use the Shortcut token as the key (recommended over IP-based limits).
if (env.DRIVE_RATE_LIMITER) {
  const token = request.headers.get("X-Drive-Token") || "unknown";
  const key = `${token}:${mode}:${url.pathname}`;
  const { success } = await env.DRIVE_RATE_LIMITER.limit({ key });
  if (!success) {
    return json({ error: "Rate limit exceeded." }, 429);
  }
}

    const body = await readJson(request);
    const utterance = (body.utterance || "").toString().trim().slice(0, 2000);
    if (!utterance) return json({ error: "Missing utterance." }, 400);

    const ctx = {
      country: (body.country || env.DEFAULT_COUNTRY || "US").toString().slice(0, 8),
      locale: (body.locale || env.DEFAULT_LOCALE || "en-US").toString().slice(0, 32),
      lat: typeof body.lat === "number" ? body.lat : null,
      lon: typeof body.lon === "number" ? body.lon : null,
      nav_preference: (body.nav_preference || env.DEFAULT_NAV_PREFERENCE || "auto").toString().slice(0, 16)
    };

    try {
      const plan = await createPlanWithOpenAI({ env, mode, utterance, ctx });

      if (plan.needs_clarification) {
        return json({
          spoken_summary: plan.spoken_summary || "I need one detail.",
          nav_url: "",
          ...(mode === "drive" ? { music_url: "" } : {})
        }, 200);
      }

      const nav_url = buildNavigationUrl(plan.navigation, ctx);

      if (mode === "nav") {
        return json({
          spoken_summary: plan.spoken_summary || "Okay.",
          nav_url
        }, 200);
      }

      const cacheTtlSeconds = parseInt(env.CACHE_TTL_SECONDS || "604800", 10);
      const music_url = await resolveAppleMusicUrl({
        music: plan.music,
        country: ctx.country,
        cacheTtlSeconds
      });

      return json({
        spoken_summary: plan.spoken_summary || "Okay.",
        nav_url,
        music_url
      }, 200);

    } catch (e) {
      return json({
        spoken_summary: "I ran into an error. I can still open a map search.",
        nav_url: "https://maps.apple.com/?q=" + encodeURIComponent("Destination"),
        ...(mode === "drive" ? { music_url: "" } : {})
      }, 200);
    }
  }
};
