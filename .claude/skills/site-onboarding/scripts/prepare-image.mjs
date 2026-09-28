#!/usr/bin/env node
// Crop, resize and convert an image to WebP (quality 80) for the site.
//
//   node .claude/skills/site-onboarding/scripts/prepare-image.mjs <avatar|cover|body> <input> <output.webp>
//
//   avatar  centre square, 216x216 (profile photo)
//   cover   3:2 cover crop, 1280x853 (project cover)
//   body    max width 1280, never enlarged (images inside a case)

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const MODES = {
  avatar: (img) => img.resize(216, 216, { fit: "cover", position: "centre" }),
  cover: (img) => img.resize(1280, 853, { fit: "cover", position: "centre" }),
  body: (img) => img.resize({ width: 1280, withoutEnlargement: true }),
};

function fail(message) {
  console.error(`prepare-image: ${message}`);
  process.exit(1);
}

const [mode, input, output] = process.argv.slice(2);

if (!MODES[mode] || !input || !output) {
  fail(
    "usage: node prepare-image.mjs <avatar|cover|body> <input> <output.webp>",
  );
}
if (!fs.existsSync(input)) {
  fail(`input file not found: ${input}`);
}

let sharp;
try {
  // Resolved from the script's folder, so it finds the project's node_modules
  // from any working directory.
  const require = createRequire(import.meta.url);
  sharp = require("sharp");
} catch {
  fail(
    "could not load `sharp`. Run `npm install` in the project folder, then try again (or `npm install sharp`).",
  );
}

try {
  fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
  const info = await MODES[mode](sharp(input).rotate())
    .webp({ quality: 80 })
    .toFile(output);
  const kb = (fs.statSync(output).size / 1024).toFixed(1);
  console.log(`${output}: ${info.width}x${info.height}, ${kb} KB`);
} catch (error) {
  fail(`could not process ${input}: ${error.message}`);
}
