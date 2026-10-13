// Preview only. The site is written for the root of its own domain, so its links look
// like "/about/". GitHub Pages serves the preview from a sub-path, and this adds that
// sub-path to every root-relative link in the built HTML. Astro already prefixes the
// files it generates itself (/_astro/...), so those are left alone.
//
// Usage: node prefix-base.mjs <dist folder> <base path, e.g. /my-repo>

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [dist, rawBase] = process.argv.slice(2);
if (!dist || !rawBase) {
  console.error('Usage: node prefix-base.mjs <dist folder> <base path>');
  process.exit(1);
}

const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}`;

// href="/x", src="/x", action="/x" -- but not "//host" and not paths already under the base.
const rootRelative = /\b(href|src|action)="\/(?!\/)([^"]*)"/g;

let changed = 0;
for (const entry of await readdir(dist, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.html')) continue;

  const file = join(entry.parentPath, entry.name);
  const html = await readFile(file, 'utf8');
  const fixed = html.replace(rootRelative, (match, attribute, path) => {
    const url = `/${path}`;
    return url === base || url.startsWith(`${base}/`) ? match : `${attribute}="${base}${url}"`;
  });

  if (fixed !== html) {
    await writeFile(file, fixed);
    changed += 1;
  }
}

console.log(`Prefixed links with ${base} in ${changed} HTML file(s).`);
