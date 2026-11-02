#!/usr/bin/env python3
"""Reads the homelab's Prometheus and writes content/status.ini (the header
numbers) and content/pulses.ini (24 hours of CPU and memory for :pulses).
In the cluster set PROM=http://prometheus.monitoring.svc:9090. Without it
the queries go over ssh to the OptiPlex, for running from the laptop."""
import json
import os
import subprocess
import time
import urllib.parse
import urllib.request

PROM = os.environ.get("PROM")
SSH = ["ssh", "-o", "ConnectTimeout=8", "root@192.168.0.156"]
NODES = {"192.168.0.156": "optiplex-7040", "192.168.0.219": "gaming-pc", "192.168.0.213": "raspberrypi"}
CPU = '100 * (1 - avg{by}(rate(node_cpu_seconds_total{{mode="idle"}}[5m])))'
MEM = "100 * (1 - sum{by}(node_memory_MemAvailable_bytes) / sum{by}(node_memory_MemTotal_bytes))"


def get(endpoint, **params):
    qs = urllib.parse.urlencode(params)
    if PROM:
        with urllib.request.urlopen(f"{PROM}/api/v1/{endpoint}?{qs}", timeout=30) as r:
            return json.load(r)["data"]["result"]
    url = f"http://$(kubectl -n monitoring get svc prometheus -o jsonpath={{.spec.clusterIP}}):9090/api/v1/{endpoint}?{qs}"
    out = subprocess.run(SSH + [f'curl -s "{url}"'], capture_output=True, text=True, timeout=90, check=True).stdout
    return json.loads(out)["data"]["result"]


def now(query):
    r = get("query", query=query)
    return r[0]["value"][1] if r else None


def series(query, hours=24, points=48):
    end = int(time.time())
    step = hours * 3600 // points
    return get("query_range", query=query, start=end - hours * 3600, end=end, step=step)


def main():
    total = now("count(kube_node_info)")
    ready = now('count(kube_node_status_condition{condition="Ready",status="true"} == 1)')
    cpu = now(CPU.format(by=""))
    mem = now(MEM.format(by=""))
    k8s = get("query", query="kube_node_info")
    version = k8s[0]["metric"].get("kubelet_version") if k8s else None
    stamp = time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime())

    lines = ["# Written by tools/metrics.py from the homelab's Prometheus."]
    if total:
        lines.append(f"nodes = {ready or 0}/{total}")
    if cpu:
        lines.append(f"cpu = {round(float(cpu))}")
    if mem:
        lines.append(f"mem = {round(float(mem))}")
    if version:
        lines.append(f"k8s = {version}")
    lines.append(f"stamp = {stamp}")
    open("content/status.ini", "w").write("\n".join(lines) + "\n")

    out = ["# 24 hours of the homelab, written by tools/metrics.py. values are percentages."]
    for key, label, q in (("cpu", "Cluster CPU", CPU.format(by="")), ("mem", "Cluster memory", MEM.format(by=""))):
        r = series(q)
        if r:
            vals = ",".join(str(round(float(v))) for _, v in r[0]["values"])
            out += ["", f"[{key}]", f"label = {label}", f"values = {vals}"]
    for r in series(CPU.format(by=" by (instance)")):
        host = NODES.get(r["metric"].get("instance", "").split(":")[0])
        if host:
            vals = ",".join(str(round(float(v))) for _, v in r["values"])
            out += ["", f"[cpu-{host}]", f"label = CPU {host}", f"values = {vals}"]
    open("content/pulses.ini", "w").write("\n".join(out) + "\n")
    print("wrote content/status.ini and content/pulses.ini")


if __name__ == "__main__":
    main()
