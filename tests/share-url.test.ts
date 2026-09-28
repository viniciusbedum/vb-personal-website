import assert from "node:assert/strict";
import test from "node:test";
import { currentPageUrl } from "../lib/share-url";

test("home has no trailing slash", () => {
  assert.equal(
    currentPageUrl({ origin: "https://anasouza.com", pathname: "/" }),
    "https://anasouza.com",
  );
});

test("keeps the locale prefix and the path", () => {
  assert.equal(
    currentPageUrl({ origin: "https://anasouza.com", pathname: "/br/work/meu-caso" }),
    "https://anasouza.com/br/work/meu-caso",
  );
});

test("uses whatever origin the visitor is on", () => {
  assert.equal(
    currentPageUrl({ origin: "http://localhost:3000", pathname: "/work" }),
    "http://localhost:3000/work",
  );
});
