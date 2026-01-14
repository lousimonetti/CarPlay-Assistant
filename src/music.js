import { cachedJsonFetch } from "./util.js";

/**
 * Resolve an Apple Music URL using the iTunes Search API.
 * Returns a track/collection/artist view URL which typically opens in Apple Music on iOS.
 */
export async function resolveAppleMusicUrl({ music, country, cacheTtlSeconds }) {
  const intent = (music?.intent || "none");
  const query = (music?.query || "").trim();

  if (intent === "none" || !query) return "";

  const entity =
    intent === "song" ? "song" :
    intent === "album" ? "album" :
    intent === "artist" ? "musicArtist" :
    "song";

  const c = (country || "US").toString().slice(0, 2).toUpperCase();
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${encodeURIComponent(entity)}&limit=1&country=${encodeURIComponent(c)}`;

  const data = await cachedJsonFetch(url, cacheTtlSeconds || 604800);
  const first = data?.results?.[0];
  if (!first) return "";

  return first.trackViewUrl || first.collectionViewUrl || first.artistViewUrl || "";
}
