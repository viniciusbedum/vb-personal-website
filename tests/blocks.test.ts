import { test } from "node:test";
import assert from "node:assert/strict";

import { isDateHeading, parseCardsBlock, parseSourceBlock } from "../lib/content/blocks";

test("parseSourceBlock reads all five fields", () => {
  assert.deepEqual(
    parseSourceBlock(
      "kicker: A · B\ntitle: T\nurl: https://x.com\nmeta: M\ndescription: D",
    ),
    { kicker: "A · B", title: "T", url: "https://x.com", meta: "M", description: "D" },
  );
});

test("parseSourceBlock returns only title and url when the rest is absent", () => {
  assert.deepEqual(parseSourceBlock("title: T\nurl: https://x.com"), {
    title: "T",
    url: "https://x.com",
  });
});

test("parseSourceBlock skips entries without title or url", () => {
  assert.equal(parseSourceBlock("url: https://x.com"), null);
  assert.equal(parseSourceBlock("title: T"), null);
  assert.equal(parseSourceBlock(""), null);
});

test("parseSourceBlock rejects non-http(s) urls", () => {
  assert.equal(parseSourceBlock("title: T\nurl: javascript:alert(1)"), null);
  assert.equal(parseSourceBlock("title: T\nurl: /relative"), null);
});

test("parseSourceBlock splits on the first colon only and ignores unknown keys", () => {
  assert.deepEqual(
    parseSourceBlock("\ntitle: Note: a title\nfoo: bar\n\nurl: https://x.com/a?b=c:d\n"),
    { title: "Note: a title", url: "https://x.com/a?b=c:d" },
  );
});

test("isDateHeading accepts YYYY, YYYY-MM and YYYY-MM-DD only", () => {
  assert.equal(isDateHeading("2026-08-19"), true);
  assert.equal(isDateHeading("2026-08"), true);
  assert.equal(isDateHeading("2026"), true);
  assert.equal(isDateHeading("Development"), false);
  assert.equal(isDateHeading("2026-8-1"), false);
});

test("parseCardsBlock reads cards separated by a blank line", () => {
  assert.deepEqual(
    parseCardsBlock(
      "image: /projects/a/1.webp\nalt: First\ntitle: One\ntext: Text: with a colon\n\nimage: /projects/a/2.webp\nalt: Second",
    ),
    [
      { image: "/projects/a/1.webp", alt: "First", title: "One", text: "Text: with a colon" },
      { image: "/projects/a/2.webp", alt: "Second" },
    ],
  );
});

test("parseCardsBlock skips cards without a site image path and defaults alt to empty", () => {
  assert.deepEqual(
    parseCardsBlock(
      "title: No image\n\nimage: https://example.com/a.png\n\nimage: //example.com/a.png\n\nimage: /ok.webp\nother: ignored",
    ),
    [{ image: "/ok.webp", alt: "" }],
  );
  assert.deepEqual(parseCardsBlock(""), []);
});
