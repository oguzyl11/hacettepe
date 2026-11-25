import assert from "node:assert/strict";
import test from "node:test";
import { applyRating, canMarkSold, canRate, toPublicOwner } from "./trade.ts";

test("public owner drops email", () => {
  const owner = toPublicOwner(
    {
      id: "u1",
      name: "Ada",
      email: "ada@hacettepe.edu.tr",
      image: null,
      instagramHandle: "ada",
      preferredContact: "INSTAGRAM",
      ratingAverage: 4,
      ratingCount: 2,
      soldCount: 1,
    },
    "Student",
  );
  assert.equal("email" in owner, false);
  assert.equal(owner.name, "Ada");
});

test("only the seller can mark a commenter as the buyer", () => {
  assert.equal(
    canMarkSold({
      actorId: "seller",
      ownerId: "seller",
      buyerId: "buyer",
      status: "ACTIVE",
      commenterIds: ["buyer"],
    }),
    true,
  );
  assert.equal(
    canMarkSold({
      actorId: "buyer",
      ownerId: "seller",
      buyerId: "buyer",
      status: "ACTIVE",
      commenterIds: ["buyer"],
    }),
    false,
  );
  assert.equal(
    canMarkSold({
      actorId: "seller",
      ownerId: "seller",
      buyerId: "seller",
      status: "ACTIVE",
      commenterIds: ["seller"],
    }),
    false,
  );
});

test("only the chosen buyer can rate a sold listing once", () => {
  assert.equal(
    canRate({ actorId: "buyer", buyerId: "buyer", status: "SOLD", alreadyRated: false }),
    true,
  );
  assert.equal(
    canRate({ actorId: "other", buyerId: "buyer", status: "SOLD", alreadyRated: false }),
    false,
  );
  assert.equal(
    canRate({ actorId: "buyer", buyerId: "buyer", status: "ACTIVE", alreadyRated: false }),
    false,
  );
  assert.equal(
    canRate({ actorId: "buyer", buyerId: "buyer", status: "SOLD", alreadyRated: true }),
    false,
  );
});

test("seller average includes the new score", () => {
  const next = applyRating({ ratingAverage: 4, ratingCount: 1 }, 2);
  assert.equal(next.ratingCount, 2);
  assert.equal(next.ratingAverage, 3);
});
