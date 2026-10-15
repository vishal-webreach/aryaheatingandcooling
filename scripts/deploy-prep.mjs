// Local deploy helper: builds the site, then copies only the files that changed
// since the last upload into dist-changed/. It never talks to the server.
// Usage: npm run deploy-prep
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const changedDir = join(root, 'dist-changed');
const manifestPath = join(root, '.deploy-manifest.json');

// 1. Build. Stop before touching anything if it fails.
const build = spawnSync('npm run build', { cwd: root, stdio: 'inherit', shell: true });
if (build.status !== 0) {
  console.error('\nBuild failed. Nothing was copied.');
  process.exit(build.status ?? 1);
}

// 2. Hash every file in dist/, keyed by its path relative to dist/ with forward slashes.
async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(full)));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

const current = {};
for (const file of await listFiles(distDir)) {
  const key = relative(distDir, file).split(sep).join('/');
  current[key] = createHash('sha256').update(await readFile(file)).digest('hex');
}

// 3. Compare with the list saved after the last upload.
const previous = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : {};

const added = [];
const changed = [];
let unchanged = 0;
for (const [path, hash] of Object.entries(current)) {
  if (!(path in previous)) added.push(path);
  else if (previous[path] !== hash) changed.push(path);
  else unchanged++;
}
const removed = Object.keys(previous).filter((path) => !(path in current)).sort();

// 4. Rebuild dist-changed/ with only the new and changed files.
await rm(changedDir, { recursive: true, force: true });
const toCopy = [...added, ...changed].sort();
for (const path of toCopy) {
  const target = join(changedDir, ...path.split('/'));
  await mkdir(dirname(target), { recursive: true });
  await cp(join(distDir, ...path.split('/')), target);
}

// 5. Summary.
console.log('\nDeploy prep summary');
console.log(`  New:       ${added.length}`);
console.log(`  Changed:   ${changed.length}`);
console.log(`  Unchanged: ${unchanged}`);
console.log(`  Removed:   ${removed.length}`);
console.log('');
console.log(toCopy.length ? 'Upload the contents of: dist-changed/' : 'Nothing new to upload');
if (removed.length) {
  console.log('\nDelete these from the server:');
  for (const path of removed) console.log(`  ${path}`);
}

if (!toCopy.length && !removed.length) process.exit(0);

// 6. Only remember this build once the user confirms the upload.
const rl = createInterface({ input: process.stdin, output: process.stdout });
const answer = (await rl.question('\nDid you upload these files? (y/N) ')).trim().toLowerCase();
rl.close();

if (answer === 'y' || answer === 'yes') {
  const sorted = Object.fromEntries(Object.keys(current).sort().map((key) => [key, current[key]]));
  await writeFile(manifestPath, JSON.stringify(sorted, null, 2) + '\n');
  console.log('Saved .deploy-manifest.json.');
} else {
  console.log('Not saved. The next run will show these changes again.');
}
