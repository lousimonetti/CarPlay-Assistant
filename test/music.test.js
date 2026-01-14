import test from "node:test";
import assert from "node:assert/strict";
import { resolveAppleMusicUrl } from "../src/music.js";

test("music none returns empty", async () => {
  const url = await resolveAppleMusicUrl({
    music: { intent: "none", query: "" },
    country: "US",
    cacheTtlSeconds: 10
  });
  assert.equal(url, "");
});
