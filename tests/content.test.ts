import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { getBodyHeadings } from "../components/work/project-body";
import { readProjectBody } from "../lib/content/projects";
import { resolveSiteUrl } from "../lib/site-url";

test("getBodyHeadings slugs and dedupes h2 headings in document order", () => {
  const body = "## Ação\n\ntext\n\n## Ação";
  assert.deepEqual(getBodyHeadings(body), [
    { id: "acao", text: "Ação" },
    { id: "acao-2", text: "Ação" },
  ]);
});

test("readProjectBody falls back from pt to en when the locale file is missing", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "content-projects-"));
  const slug = "fallback-example";
  const cwd = process.cwd();

  fs.mkdirSync(path.join(root, "content/projects", slug), { recursive: true });
  const enContent = "## Only in English\n\nBody text.\n";
  fs.writeFileSync(path.join(root, "content/projects", slug, "en.md"), enContent);

  process.chdir(root);
  try {
    assert.equal(readProjectBody(slug, "pt"), enContent);
    assert.equal(readProjectBody(slug, "en"), enContent);
    assert.equal(readProjectBody("does-not-exist", "en"), "");
  } finally {
    process.chdir(cwd);
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("resolveSiteUrl resolves Vercel, explicit and fallback URLs", () => {
  assert.equal(
    resolveSiteUrl({ VERCEL: "1", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }),
    "https://x.vercel.app",
  );
  assert.equal(
    resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://a.com/" }),
    "https://a.com",
  );
  assert.equal(resolveSiteUrl({}), "http://localhost:3000");
});
