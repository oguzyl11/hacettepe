import assert from "node:assert/strict";
import test from "node:test";
import { isHacettepeEmail } from "./utils.ts";
import { instagramUrl } from "./instagram.ts";

test("only exact hacettepe addresses pass", () => {
  assert.equal(isHacettepeEmail("ada@hacettepe.edu.tr"), true);
  assert.equal(isHacettepeEmail("ada@gmail.com"), false);
  assert.equal(isHacettepeEmail("ada@hacettepe.edu.tr.evil.com"), false);
});

test("instagram links use a normalized https profile url", () => {
  assert.equal(instagramUrl("@Ada.Lovelace"), "https://www.instagram.com/ada.lovelace/");
  assert.equal(instagramUrl("not a handle"), null);
  assert.equal(instagramUrl(""), null);
});
