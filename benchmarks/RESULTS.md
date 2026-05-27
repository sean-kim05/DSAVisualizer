# DSA Visualizer Benchmarks

**Date:** 2026-05-27
**Stack:** React 18 + Vite frontend, Flask backend with Claude Sonnet 4.6 SSE streaming
**Hardware:** macOS Apple Silicon
**Build:** Vite 4.5 production build (`npx vite build --base=/`), served via `serve` on `:4173`

---

## Lighthouse (production build, median of 3 runs, headless Chrome, desktop preset)

| metric | value |
|--|--:|
| Performance score        | **99 / 100** |
| First Contentful Paint   | 667 ms |
| Largest Contentful Paint | 770 ms |
| Time to Interactive      | 770 ms |
| Total Blocking Time      | 0 ms |
| Cumulative Layout Shift  | 0.000 |
| Speed Index              | 685 ms |

Notes:
- The default vite config sets `base: '/DSAVisualizer/'` for GitHub Pages. For local Lighthouse we rebuild with `--base=/` so asset URLs resolve at the root (otherwise Chrome paints nothing and Lighthouse reports NO_FCP).
- TBT = 0 ms means no long tasks blocked the main thread during load — the bundle parses fast.

---

## Bundle Size (production build, `dist/assets/`)

| group | files | raw | gzipped |
|--|--:|--:|--:|
| JS    | 3 | 431.81 KB | 116.35 KB |
| CSS   | 1 |  30.08 KB |   6.35 KB |
| **TOTAL** | 4 | **461.89 KB** | **122.70 KB** |

Largest chunk: `dist/assets/index-fd27240b.js` — 233.56 KB raw / 69.41 KB gzip (the main app bundle including all algorithm modules and React).

Notes:
- The dynamic-import statements in the page code use template strings without a static file-extension suffix, which prevents Vite from splitting per algorithm. Fixing those imports would let pathfinding / sorting algos lazy-load (currently they all land in the main chunk).
- 122.7 KB gzip across 8 interactive visualizers + AI panel + routing is lean.

---

## AI Tutor TTFT — `POST /api/explain` (local Flask → Claude Sonnet 4.6 SSE)

20 serial runs against the local Flask backend on `:5001`, payload:
`{algorithm: "Dijkstra's Algorithm", question: "How does this work?", history: []}`

| metric | TTFT | Total |
|--|--:|--:|
| mean | 1,136 ms | 10,016 ms |
| p50  |   969 ms |  9,994 ms |
| p95  | 2,647 ms | 12,000 ms |
| p99  | 2,647 ms | 12,000 ms |
| min  |   862 ms |  9,355 ms |
| max  | 2,647 ms | 12,000 ms |
| failures | 0 / 20 | — |

Notes:
- TTFT is dominated by the local-host → Anthropic API round trip + Claude's first-token latency; the Flask layer adds <5 ms on top.
- Total time scales with output length — answers cap around 1024 tokens, so ~10 s is the steady-state response length.

---

## Raw data

Under `benchmarks/results/`:
- `lighthouse_summary.json` — median of 3, plus the per-run array
- `lighthouse_run{1,2,3}.json` — full Lighthouse reports
- `bundle.json` — file-level raw + gzip breakdown
- `ai_ttft.json` — 20-run TTFT + total stats

---

## Headlines (paste into resume — pick one)

- **Lighthouse performance score 99/100** with 770 ms LCP and 0 ms Total Blocking Time on the production build.
- **122 KB gzipped bundle** across 8 interactive algorithm visualizers + an AI tutor panel.
- **p95 AI tutor TTFT 2.6 s** (median 969 ms) via Claude Sonnet 4.6 SSE streaming from Flask backend.
