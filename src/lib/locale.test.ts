import assert from "node:assert/strict";
import test from "node:test";
import { localizePath, signInHref, stripLocalePrefix, switchLocalePath } from "./locale.ts";

test("turkish paths stay unprefixed", () => {
  assert.equal(localizePath("tr", "/ilan/yeni"), "/ilan/yeni");
  assert.equal(localizePath("tr", "/en/ilan/yeni"), "/ilan/yeni");
  assert.equal(localizePath("tr", "/?kategori=KITAP#ilanlar"), "/?kategori=KITAP#ilanlar");
});

test("english paths keep the en prefix once", () => {
  assert.equal(localizePath("en", "/"), "/en");
  assert.equal(localizePath("en", "/ilan/abc"), "/en/ilan/abc");
  assert.equal(localizePath("en", "/en/ilan/abc"), "/en/ilan/abc");
  assert.equal(localizePath("en", "/#nasil"), "/en#nasil");
});

test("switching locale keeps the page and the query", () => {
  assert.equal(switchLocalePath("/en/ilan/abc", "q=lamba", "tr"), "/ilan/abc?q=lamba");
  assert.equal(switchLocalePath("/ayarlar", "", "en"), "/en/ayarlar");
  assert.equal(stripLocalePrefix("/en"), "/");
});

test("sign-in return path uses the same locale", () => {
  assert.equal(signInHref("en", "/ilan/yeni"), "/en/giris?donus=%2Fen%2Filan%2Fyeni");
  assert.equal(signInHref("tr", "/ilanlarim"), "/giris?donus=%2Filanlarim");
});
