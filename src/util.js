export function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function nowIso() {
  return new Date().toISOString();
}

export function extractFirstOutputText(responsesApiJson) {
  const out = responsesApiJson?.output;
  if (!Array.isArray(out)) throw new Error("Missing output array.");

  for (const item of out) {
    const c = item?.content;
    if (!Array.isArray(c)) continue;
    for (const part of c) {
      if (part?.type === "output_text" && typeof part?.text === "string") {
        return part.text;
      }
    }
  }
  throw new Error("No output_text found.");
}

export function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Model returned non-JSON.");
  }
}

/**
 * Cache helper using Cloudflare’s default cache.
 * Note: in local dev this may behave differently; it is still safe.
 */
export async function cachedJsonFetch(url, ttlSeconds) {
  const req = new Request(url, { method: "GET" });
  const cache = caches.default;

  let res = await cache.match(req);
  if (!res) {
    res = await fetch(req);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const resToCache = new Response(res.clone().body, res);
    resToCache.headers.set("Cache-Control", `public, max-age=${Math.max(60, ttlSeconds || 604800)}`);
    await cache.put(req, resToCache);
  }

  return await res.json();
}
