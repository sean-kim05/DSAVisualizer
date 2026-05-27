// Bundle-size benchmark for the production build.
//
// Walks dist/assets, sums raw + gzipped sizes by category (js/css/other),
// flags the largest individual chunk, and writes a JSON report.
//
// Usage:
//   npm run build           # produce dist/
//   node benchmarks/bench_bundle.js

import { readdirSync, statSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = dirname(new URL(import.meta.url).pathname);
const REPO = dirname(ROOT);
const ASSETS = join(REPO, 'dist', 'assets');
const OUT = join(ROOT, 'results', 'bundle.json');

function readFilesRecursive(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? readFilesRecursive(p) : [p];
  });
}

function kb(bytes) {
  return +(bytes / 1024).toFixed(2);
}

try {
  statSync(ASSETS);
} catch {
  console.error(`error: ${ASSETS} not found. Run "npm run build" first.`);
  process.exit(1);
}

const files = readFilesRecursive(ASSETS);
const buckets = { js: [], css: [], other: [] };
for (const path of files) {
  const ext = extname(path).toLowerCase().replace('.', '');
  const buf = readFileSync(path);
  const gzip = gzipSync(buf);
  const entry = {
    file: path.replace(REPO + '/', ''),
    raw_bytes: buf.length,
    gzip_bytes: gzip.length,
    raw_kb: kb(buf.length),
    gzip_kb: kb(gzip.length),
  };
  if (ext === 'js') buckets.js.push(entry);
  else if (ext === 'css') buckets.css.push(entry);
  else buckets.other.push(entry);
}

function sumGroup(arr) {
  const raw = arr.reduce((a, x) => a + x.raw_bytes, 0);
  const gz = arr.reduce((a, x) => a + x.gzip_bytes, 0);
  return { count: arr.length, raw_kb: kb(raw), gzip_kb: kb(gz) };
}

const totals = {
  js: sumGroup(buckets.js),
  css: sumGroup(buckets.css),
  other: sumGroup(buckets.other),
};
const totalRaw = buckets.js.concat(buckets.css, buckets.other).reduce((a, x) => a + x.raw_bytes, 0);
const totalGz = buckets.js.concat(buckets.css, buckets.other).reduce((a, x) => a + x.gzip_bytes, 0);

const largest = [...buckets.js, ...buckets.css, ...buckets.other]
  .sort((a, b) => b.raw_bytes - a.raw_bytes)[0];

const report = {
  generated: new Date().toISOString(),
  totals,
  total_kb: kb(totalRaw),
  total_gzip_kb: kb(totalGz),
  largest_chunk: largest,
  files: { js: buckets.js, css: buckets.css, other: buckets.other },
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(report, null, 2));

console.log('Bundle size breakdown:');
for (const [k, v] of Object.entries(totals)) {
  console.log(`  ${k.padEnd(5)} ${v.count.toString().padStart(2)} files   raw ${v.raw_kb.toString().padStart(8)} KB   gzip ${v.gzip_kb.toString().padStart(8)} KB`);
}
console.log(`  ${'TOTAL'.padEnd(5)}              raw ${kb(totalRaw).toString().padStart(8)} KB   gzip ${kb(totalGz).toString().padStart(8)} KB`);
console.log(`Largest chunk: ${largest.file} (${largest.raw_kb} KB raw, ${largest.gzip_kb} KB gzip)`);
console.log(`\nSaved ${OUT}`);
