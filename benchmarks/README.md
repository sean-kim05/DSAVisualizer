# DSAVisualizer benchmarks

Three small benchmarks, all rooted at the repo root.

## Run

```bash
# Bundle size: scans dist/ and reports raw + gzipped totals
npm run build
node benchmarks/bench_bundle.js

# Lighthouse: builds, serves dist on :4173, runs Lighthouse 3× (median)
chmod +x benchmarks/bench_lighthouse.sh
benchmarks/bench_lighthouse.sh

# Claude AI tutor TTFT (requires local backend running on :5001 with ANTHROPIC_API_KEY)
cd backend && python app.py &   # in another shell
python benchmarks/bench_ai_ttft.py
```

Each script writes a JSON report to `benchmarks/results/`. See `RESULTS.md`
for the headline numbers from the last run.

## Tooling

```bash
npm install -g lighthouse serve   # used by bench_lighthouse.sh
```
