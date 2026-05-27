// Reads benchmarks/results/lighthouse_run{1,2,3}.json and writes a per-metric
// median to benchmarks/results/lighthouse_summary.json. Median is computed
// independently for each metric — this is the standard guidance for
// dealing with Lighthouse's per-run variance.

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = dirname(new URL(import.meta.url).pathname);
const RESULTS = join(ROOT, 'results');

const RUNS = [1, 2, 3]
  .map((i) => join(RESULTS, `lighthouse_run${i}.json`))
  .map((p) => {
    try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
  })
  // Filter out NO_FCP / runtime-error runs — they're missing audit data and
  // would otherwise NaN the median.
  .filter((r) => r && r.categories?.performance?.score !== null && r.audits?.['first-contentful-paint']?.numericValue != null);

if (RUNS.length === 0) {
  console.error('no usable lighthouse runs in', RESULTS);
  process.exit(1);
}

const METRICS = {
  performance_score: (r) => Math.round(r.categories.performance.score * 100),
  fcp_ms: (r) => r.audits['first-contentful-paint'].numericValue,
  lcp_ms: (r) => r.audits['largest-contentful-paint'].numericValue,
  tti_ms: (r) => r.audits['interactive'].numericValue,
  tbt_ms: (r) => r.audits['total-blocking-time'].numericValue,
  cls: (r) => r.audits['cumulative-layout-shift'].numericValue,
  speed_index_ms: (r) => r.audits['speed-index'].numericValue,
};

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

const summary = {
  generated: new Date().toISOString(),
  runs_used: RUNS.length,
  per_run: RUNS.map((r) => Object.fromEntries(
    Object.entries(METRICS).map(([k, fn]) => [k, fn(r)])
  )),
  median: Object.fromEntries(
    Object.entries(METRICS).map(([k, fn]) => [k, median(RUNS.map(fn))])
  ),
};

writeFileSync(join(RESULTS, 'lighthouse_summary.json'), JSON.stringify(summary, null, 2));

console.log('\nLighthouse — median of', RUNS.length, 'runs:');
const m = summary.median;
console.log(`  Performance score        ${m.performance_score}/100`);
console.log(`  First Contentful Paint   ${m.fcp_ms.toFixed(0)} ms`);
console.log(`  Largest Contentful Paint ${m.lcp_ms.toFixed(0)} ms`);
console.log(`  Time to Interactive      ${m.tti_ms.toFixed(0)} ms`);
console.log(`  Total Blocking Time      ${m.tbt_ms.toFixed(0)} ms`);
console.log(`  Cumulative Layout Shift  ${m.cls.toFixed(3)}`);
console.log(`  Speed Index              ${m.speed_index_ms.toFixed(0)} ms`);
console.log(`\nSaved ${join(RESULTS, 'lighthouse_summary.json')}`);
