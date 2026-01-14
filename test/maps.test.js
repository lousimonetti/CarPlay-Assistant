import test from "node:test";
import assert from "node:assert/strict";
import { buildNavigationUrl } from "../src/maps.js";

test("Apple Maps single destination", () => {
  const url = buildNavigationUrl(
    { provider: "apple", destination: "Starbucks Detroit", stops: [], travel_mode: "driving" },
    { nav_preference: "auto" }
  );
  assert.ok(url.startsWith("https://maps.apple.com/"));
  assert.ok(url.includes("daddr="));
});

test("Google Maps waypoints when stops exist", () => {
  const url = buildNavigationUrl(
    { provider: "auto", destination: "Home", stops: ["Costco", "Home Depot"], travel_mode: "driving" },
    { nav_preference: "apple" }
  );
  assert.ok(url.startsWith("https://www.google.com/maps/dir/?api=1"));
  assert.ok(url.includes("waypoints="));
});

test("Waze provider explicit", () => {
  const url = buildNavigationUrl(
    { provider: "waze", destination: "DTW Airport", stops: [], travel_mode: "driving" },
    { nav_preference: "auto" }
  );
  assert.ok(url.startsWith("https://waze.com/ul"));
});
