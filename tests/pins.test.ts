import { test } from "node:test";
import assert from "node:assert/strict";

import { applyPins, orderFeatured, MAX_PINS } from "../lib/content/pins";

const slugs = (items: { slug: string }[]) => items.map((item) => item.slug);

test("applyPins without pins orders by year desc", () => {
  const out = applyPins([
    { slug: "a", year: 2022 },
    { slug: "b", year: 2025 },
    { slug: "c", year: 2023 },
  ]);
  assert.deepEqual(slugs(out), ["b", "c", "a"]);
  assert.ok(out.every((item) => item.pinned === false));
});

test("applyPins puts pins first, latest pinnedAt first, then the rest by year", () => {
  const out = applyPins([
    { slug: "a", year: 2025 },
    { slug: "b", year: 2020, pinnedAt: "2026-01-01" },
    { slug: "c", year: 2021, pinnedAt: "2026-03-01" },
    { slug: "d", year: 2024 },
  ]);
  assert.deepEqual(slugs(out), ["c", "b", "a", "d"]);
  assert.deepEqual(
    out.map((item) => item.pinned),
    [true, true, false, false],
  );
});

test("applyPins only counts the 5 most recent pins", () => {
  const items = Array.from({ length: 6 }, (_, i) => ({
    slug: `p${i}`,
    year: 2000 + i,
    pinnedAt: `2026-01-0${i + 1}`,
  }));
  const out = applyPins(items);
  assert.equal(MAX_PINS, 5);
  assert.equal(out.filter((item) => item.pinned).length, 5);
  assert.deepEqual(slugs(out), ["p5", "p4", "p3", "p2", "p1", "p0"]);
  assert.equal(out[5].pinned, false);
});

test("applyPins overflow pin falls into year order", () => {
  const items = [
    { slug: "old", year: 2030, pinnedAt: "2026-01-01" },
    ...Array.from({ length: 5 }, (_, i) => ({
      slug: `p${i}`,
      year: 2000,
      pinnedAt: `2026-02-0${i + 1}`,
    })),
    { slug: "mid", year: 2010 },
  ];
  const out = applyPins(items);
  assert.deepEqual(slugs(out).slice(5), ["old", "mid"]);
});

test("applyPins is deterministic on equal pinnedAt (year desc, then list order)", () => {
  const out = applyPins([
    { slug: "a", year: 2020, pinnedAt: "2026-01-01" },
    { slug: "b", year: 2024, pinnedAt: "2026-01-01" },
    { slug: "c", year: 2024, pinnedAt: "2026-01-01" },
  ]);
  assert.deepEqual(slugs(out), ["b", "c", "a"]);
});

test("orderFeatured moves pinned featured items first", () => {
  const items = [
    { slug: "a" },
    { slug: "b", pinned: true, pinnedAt: "2026-01-01" },
    { slug: "c" },
  ];
  assert.deepEqual(slugs(orderFeatured(items, ["a", "b", "c"])), ["b", "a", "c"]);
});

test("orderFeatured excludes pinned items outside the featured list and unknown slugs", () => {
  const items = [
    { slug: "a" },
    { slug: "b", pinned: true, pinnedAt: "2026-01-01" },
  ];
  assert.deepEqual(slugs(orderFeatured(items, ["a", "zzz"])), ["a"]);
});

test("orderFeatured with an empty list returns the input", () => {
  const items = [{ slug: "a" }, { slug: "b" }];
  assert.equal(orderFeatured(items, []), items);
});
