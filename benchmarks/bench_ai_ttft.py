"""Claude AI tutor TTFT benchmark.

Hits the LOCAL Flask backend (default http://localhost:5001) which proxies to
Anthropic with SSE streaming. Measures time-to-first-token from the SSE
stream — defined as the first `data: {...}` chunk with non-empty `text`.

20 serial runs. The backend must be running and ANTHROPIC_API_KEY must be set
in backend/.env.

Usage:
    python benchmarks/bench_ai_ttft.py [--host http://localhost:5001]
"""
from __future__ import annotations

import argparse
import json
import os
import statistics
import sys
import time
import urllib.request
import urllib.error


DEFAULT_HOST = "http://localhost:5001"
RUNS = 20
RESULTS_PATH = os.path.join(os.path.dirname(__file__), "results", "ai_ttft.json")


PAYLOAD = {
    "algorithm": "Dijkstra's Algorithm",
    "question": "How does this work?",
    "history": [],
}


def stats(samples_ms: list[float]) -> dict:
    if not samples_ms:
        return {"count": 0}
    s = sorted(samples_ms)
    pct = lambda p: s[min(len(s) - 1, int(p / 100 * len(s)))]  # noqa: E731
    return {
        "count": len(s),
        "mean_ms": round(statistics.fmean(s), 2),
        "p50_ms": round(pct(50), 2),
        "p95_ms": round(pct(95), 2),
        "p99_ms": round(pct(99), 2),
        "min_ms": round(s[0], 2),
        "max_ms": round(s[-1], 2),
    }


def one_run(host: str, payload: dict) -> tuple[float, float, bool]:
    """Return (ttft_ms, total_ms, ok)."""
    req = urllib.request.Request(
        f"{host}/api/explain",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json", "Accept": "text/event-stream"},
        method="POST",
    )
    t0 = time.perf_counter()
    ttft = None
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            buf = b""
            while True:
                chunk = resp.read1(4096)
                if not chunk:
                    break
                buf += chunk
                # Process complete SSE lines.
                while b"\n" in buf:
                    line, buf = buf.split(b"\n", 1)
                    if not line.startswith(b"data: "):
                        continue
                    try:
                        payload = json.loads(line[6:])
                    except json.JSONDecodeError:
                        continue
                    if payload.get("type") == "text" and payload.get("text"):
                        if ttft is None:
                            ttft = (time.perf_counter() - t0) * 1000
                    if payload.get("type") == "error":
                        return ((time.perf_counter() - t0) * 1000,
                                (time.perf_counter() - t0) * 1000, False)
        total = (time.perf_counter() - t0) * 1000
        if ttft is None:
            return total, total, False
        return ttft, total, True
    except (urllib.error.URLError, TimeoutError) as e:
        sys.stderr.write(f"  request failed: {e}\n")
        return -1, (time.perf_counter() - t0) * 1000, False


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--runs", type=int, default=RUNS)
    args = parser.parse_args()

    sys.stderr.write(f"target: {args.host}\nrunning {args.runs} serial /api/explain calls ...\n")

    ttfts: list[float] = []
    totals: list[float] = []
    errors = 0
    for i in range(1, args.runs + 1):
        ttft, total, ok = one_run(args.host, PAYLOAD)
        if not ok:
            errors += 1
            sys.stderr.write(f"  run {i}/{args.runs} ERROR\n")
            continue
        ttfts.append(ttft)
        totals.append(total)
        if i == 1 or i % 5 == 0 or i == args.runs:
            sys.stderr.write(f"  run {i}/{args.runs} — TTFT {ttft:.0f} ms  total {total:.0f} ms\n")

    summary = {
        "host": args.host,
        "runs": args.runs,
        "successful": len(ttfts),
        "errors": errors,
        "ttft": stats(ttfts),
        "total": stats(totals),
        "generated": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }

    os.makedirs(os.path.dirname(RESULTS_PATH), exist_ok=True)
    with open(RESULTS_PATH, "w") as f:
        json.dump(summary, f, indent=2)

    print()
    print(f"AI tutor TTFT (n={len(ttfts)}/{args.runs}):")
    print(f"  mean TTFT : {summary['ttft'].get('mean_ms', '—')} ms")
    print(f"  p50  TTFT : {summary['ttft'].get('p50_ms', '—')} ms")
    print(f"  p95  TTFT : {summary['ttft'].get('p95_ms', '—')} ms")
    print(f"  p99  TTFT : {summary['ttft'].get('p99_ms', '—')} ms")
    print(f"  mean total: {summary['total'].get('mean_ms', '—')} ms")
    print(f"  p95  total: {summary['total'].get('p95_ms', '—')} ms")
    print()
    print(f"Saved {RESULTS_PATH}")
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
