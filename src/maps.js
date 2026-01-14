function normProvider(v) {
  const s = (v || "").toString().toLowerCase();
  if (s === "apple" || s === "google" || s === "waze") return s;
  return "auto";
}

function appleDirFlg(mode) {
  if (mode === "walking") return "w";
  if (mode === "transit") return "r";
  return "d";
}

/**
 * Navigation URL builder.
 *
 * Apple Maps (Map Links): https://maps.apple.com/?daddr=...&dirflg=d
 * Google Maps URLs (api=1): https://www.google.com/maps/dir/?api=1&destination=...&waypoints=a|b
 * Waze: https://waze.com/ul?q=...&navigate=yes
 */
export function buildNavigationUrl(nav, ctx) {
  const requested = normProvider(nav?.provider || "auto");
  const pref = normProvider(ctx?.nav_preference || "auto");

  const destination = (nav?.destination || "").trim();
  const stops = Array.isArray(nav?.stops)
    ? nav.stops.map(s => (s || "").trim()).filter(Boolean)
    : [];
  const travelMode = (nav?.travel_mode || "driving");

  if (!destination) {
    return `https://maps.apple.com/?q=${encodeURIComponent("Destination")}`;
  }

  const provider = chooseProvider(requested, pref, stops);

  if (provider === "apple") {
    return `https://maps.apple.com/?daddr=${encodeURIComponent(destination)}&dirflg=${appleDirFlg(travelMode)}`;
  }

  if (provider === "google") {
    const mode =
      travelMode === "walking" ? "walking" :
      travelMode === "transit" ? "transit" :
      "driving";

    const waypoints = stops.length ? `&waypoints=${encodeURIComponent(stops.join("|"))}` : "";
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=${encodeURIComponent(mode)}${waypoints}`;
  }

  return `https://waze.com/ul?q=${encodeURIComponent(destination)}&navigate=yes`;
}

function chooseProvider(requested, preference, stops) {
  if (requested !== "auto") return requested;
  if (stops && stops.length) return "google";
  if (preference !== "auto") return preference;
  return "apple";
}
