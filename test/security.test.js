import test from "node:test";
import assert from "node:assert/strict";
import { requireToken } from "../src/security.js";

test("requires token", () => {
  const req = new Request("https://example.com/plan/nav", { headers: { "X-Drive-Token": "abc" } });
  const res = requireToken(req, { DRIVE_ASSISTANT_TOKEN: "abc" });
  assert.equal(res.ok, true);
});

test("rejects wrong token", () => {
  const req = new Request("https://example.com/plan/nav", { headers: { "X-Drive-Token": "nope" } });
  const res = requireToken(req, { DRIVE_ASSISTANT_TOKEN: "abc" });
  assert.equal(res.ok, false);
  assert.equal(res.status, 401);
});
