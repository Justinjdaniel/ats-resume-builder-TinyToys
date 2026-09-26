import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const configuredBasePath = process.env.VITE_BASE_PATH || "/";
const basePath =
  configuredBasePath === "/"
    ? "/"
    : `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}/`;

const html = await readFile("dist/index.html", "utf8");
const manifest = JSON.parse(
  await readFile("dist/manifest.webmanifest", "utf8"),
);
const localHtmlUrls = [...html.matchAll(/(?:src|href)="(\/[^\"]*)"/g)].map(
  (match) => match[1],
);

assert.ok(localHtmlUrls.length > 0, "Built HTML should reference local assets");
for (const url of localHtmlUrls) {
  assert.ok(
    url.startsWith(basePath),
    `Built HTML URL ${url} is outside the configured base path ${basePath}`,
  );
}

assert.equal(
  manifest.id,
  basePath,
  "PWA manifest ID should match the base path",
);
assert.equal(
  manifest.start_url,
  basePath,
  "PWA start URL should match the base path",
);
assert.equal(manifest.scope, basePath, "PWA scope should match the base path");
assert.ok(Array.isArray(manifest.icons), "PWA manifest should define icons");
for (const icon of manifest.icons) {
  assert.ok(
    icon.src.startsWith(basePath),
    `PWA icon ${icon.src} is outside the configured base path ${basePath}`,
  );
}

console.log(`Verified GitHub Pages artifact under ${basePath}`);
