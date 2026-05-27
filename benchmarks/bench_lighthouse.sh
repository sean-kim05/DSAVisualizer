#!/usr/bin/env bash
# Lighthouse benchmark for the production build.
#
# Builds, serves dist/ on a free port, runs Lighthouse 3 times (the tool has
# real run-to-run variance), then computes the MEDIAN of each metric across
# the 3 runs and writes it to benchmarks/results/lighthouse_summary.json.
#
# Per-run reports stay at benchmarks/results/lighthouse_run{1,2,3}.json.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RESULTS_DIR="$ROOT/benchmarks/results"
PORT=4173
URL="http://localhost:$PORT"

mkdir -p "$RESULTS_DIR"

echo "[$(date +%H:%M:%S)] building production bundle with root base path ..."
# The default vite config sets base='/DSAVisualizer/' for prod (GitHub Pages
# subpath). For Lighthouse we serve dist/ at the root, so override base to '/'
# otherwise asset URLs 404 and Chrome paints nothing (NO_FCP).
cd "$ROOT"
npx vite build --base=/ > "$RESULTS_DIR/build.log" 2>&1 || {
  echo "build failed — see $RESULTS_DIR/build.log"
  exit 1
}

echo "[$(date +%H:%M:%S)] starting static server on :$PORT ..."
# `serve -s` serves single-page apps with SPA fallback (so deep links work)
serve -s "$ROOT/dist" -l "$PORT" > "$RESULTS_DIR/serve.log" 2>&1 &
SERVE_PID=$!
trap 'kill $SERVE_PID 2>/dev/null || true' EXIT

# Wait for the server to be ready.
for i in $(seq 1 20); do
  if curl -fs "$URL" -o /dev/null; then
    echo "[$(date +%H:%M:%S)] server up"
    break
  fi
  sleep 0.25
done

for i in 1 2 3; do
  out="$RESULTS_DIR/lighthouse_run${i}.json"
  echo "[$(date +%H:%M:%S)] lighthouse run $i/3 → $out"
  lighthouse "$URL" \
    --only-categories=performance \
    --output=json \
    --output-path="$out" \
    --chrome-flags="--headless=new --no-sandbox" \
    --quiet \
    --preset=desktop || {
      echo "lighthouse run $i failed; continuing"
    }
done

echo "[$(date +%H:%M:%S)] computing medians ..."
node "$ROOT/benchmarks/_lighthouse_median.js"

echo "[$(date +%H:%M:%S)] done"
