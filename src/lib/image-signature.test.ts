import assert from "node:assert/strict";
import test from "node:test";
import { imageExtension } from "./image-signature.ts";

test("accepts jpeg png and webp signatures", () => {
  assert.equal(imageExtension(Uint8Array.of(0xff, 0xd8, 0xff, 0x00)), "jpg");
  assert.equal(imageExtension(Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0)), "png");
  const webp = new Uint8Array(12);
  webp.set([0x52, 0x49, 0x46, 0x46], 0);
  webp.set([0x57, 0x45, 0x42, 0x50], 8);
  assert.equal(imageExtension(webp), "webp");
});

test("rejects a file that only claims to be an image", () => {
  assert.equal(imageExtension(Uint8Array.from([0x3c, 0x68, 0x74, 0x6d, 0x6c])), null);
});
