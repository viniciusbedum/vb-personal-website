import { test } from "node:test";
import assert from "node:assert/strict";

import { isDateHeading, parseSourceBlock } from "../lib/content/blocks";

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
