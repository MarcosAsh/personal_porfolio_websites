#!/usr/bin/env python3
"""Keeps the Keras nightly benchmark history in content/bench/keras.csv.

The nightly (homelab cluster/keras-nightly) pushes samples/s per backend,
model and mode to the Pushgateway, and Prometheus only keeps so much. This
reads what Prometheus has, splits it into runs (a run is a new pushed value)
and merges them into the CSV, which lives in git and only grows.
PROM works as in tools/metrics.py: set it in the cluster, ssh otherwise."""
import csv
import os
import time

from metrics import get

OUT = "content/bench/keras.csv"
FIELDS = ["time", "backend", "device", "model", "mode", "samples_per_s", "keras_commit"]
DAYS = 60
STEP = 3600


def runs(series):
    """A run starts wherever the pushed value changes."""
    last = None
    for t, v in series:
        if v != last:
            yield int(t), float(v)
        last = v


def main():
    end = int(time.time())
    start = end - DAYS * 86400
    bench = get("query_range", query="keras_nightly_bench_samples_per_second", start=start, end=end, step=STEP)
    info = get("query_range", query="keras_nightly_info", start=start, end=end, step=STEP)

    # which keras commit each backend/device was testing, hour by hour
    commit_at = {}
    for r in info:
        m = r["metric"]
        for t, _ in r["values"]:
            commit_at[(m.get("backend"), m.get("device"), int(t))] = m.get("keras_commit", "")

    rows = {}
    if os.path.exists(OUT):
        with open(OUT) as f:
            for row in csv.DictReader(f):
                rows[tuple(row[k] for k in FIELDS[:5])] = row
    for r in bench:
        m = r["metric"]
        for t, v in runs(r["values"]):
            stamp = time.strftime("%Y-%m-%dT%H:%MZ", time.gmtime(t))
            key = (stamp, m["backend"], m["device"], m["model"], m["mode"])
            if key not in rows:
                rows[key] = dict(zip(FIELDS, list(key) + [f"{v:.2f}", commit_at.get((m["backend"], m["device"], t), "")]))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", newline="") as f:
        w = csv.DictWriter(f, FIELDS)
        w.writeheader()
        for key in sorted(rows):
            w.writerow(rows[key])
    print(f"{OUT}: {len(rows)} runs")


if __name__ == "__main__":
    main()
