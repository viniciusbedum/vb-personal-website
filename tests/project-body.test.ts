import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ProjectBody } from "../components/work/project-body";

const render = (body: string) => renderToStaticMarkup(createElement(ProjectBody, { body }));

/** True when some `<figure>` opens before the enclosing `<p>` closes. */
const hasFigureInParagraph = (html: string) => /<p[\s>](?:(?!<\/p>)[\s\S])*<figure/.test(html);

test("an image alone on a line renders a figure outside any paragraph", () => {
  const html = render("Some text.\n\n![Alt text](/placeholder-thumbnail.svg)\n\nMore text.");

  assert.equal(html.match(/<figure/g)?.length, 1);
  assert.equal(hasFigureInParagraph(html), false);
  assert.match(html, /<p>Some text\.<\/p>/);
  assert.match(html, /<p>More text\.<\/p>/);
});

test("images on consecutive lines and an image inside a link also stay outside paragraphs", () => {
  const html = render(
    "![One](/placeholder-thumbnail.svg)\n![Two](/placeholder-thumbnail.svg)\n\n[![Three](/placeholder-thumbnail.svg)](https://example.com)",
  );

  assert.equal(html.match(/<figure/g)?.length, 3);
  assert.equal(html.includes("<p"), false);
});

test("a paragraph with only text or only a link keeps its paragraph", () => {
  assert.match(render("Just text."), /<p>Just text\.<\/p>/);
  assert.match(render("[A link](https://example.com)"), /<p><a [^>]*>A link<\/a><\/p>/);
});

test("a cards block renders a grid with one figure per card", () => {
  const html = render(
    "```cards\nimage: /placeholder-thumbnail.svg\nalt: First\ntitle: One\ntext: About one.\n\nimage: /placeholder-thumbnail.svg\nalt: Second\n```",
  );

  assert.match(html, /sm:grid-cols-2/);
  assert.equal(html.match(/<figure/g)?.length, 2);
  assert.equal(html.match(/<figcaption/g)?.length, 1);
  assert.match(html, /<p class="text-foreground">One<\/p>/);
  assert.match(html, /About one\./);
  assert.equal(html.includes("<pre"), false);
});

test("a cards block without a valid card renders nothing", () => {
  assert.equal(render("```cards\ntitle: No image\n```").includes("<figure"), false);
});
