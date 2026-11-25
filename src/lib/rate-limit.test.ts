import assert from "node:assert/strict";
import test from "node:test";
import { rateLimit, resetRateLimits } from "./rate-limit.ts";

test("rate limit blocks the call after the window is full", () => {
  resetRateLimits();
  assert.equal(rateLimit("magic:ada", 1, 60_000), true);
  assert.equal(rateLimit("magic:ada", 1, 60_000), false);
  assert.equal(rateLimit("magic:other", 1, 60_000), true);
});
