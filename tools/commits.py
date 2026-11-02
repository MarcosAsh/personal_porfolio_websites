#!/usr/bin/env python3
"""Fetches the latest commits of each project with a GitHub repo, for the
logs view (press l on a project). Writes content/commits/<project>.txt as
"date<TAB>sha<TAB>subject" lines. Uses GITHUB_TOKEN if set, which lifts
GitHub's 60 requests an hour limit."""
import configparser
import json
import os
import urllib.request

projects = configparser.ConfigParser(strict=False, interpolation=None)
projects.read_string(open("content/projects.ini").read())
os.makedirs("content/commits", exist_ok=True)
headers = {"Accept": "application/vnd.github+json", "User-Agent": "marcos-website"}
if os.environ.get("GITHUB_TOKEN"):
    headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]

for name in projects.sections():
    repo = projects[name].get("repo", "")
    if not repo.startswith("https://github.com/"):
        continue
    url = f"https://api.github.com/repos/{repo.removeprefix('https://github.com/')}/commits?per_page=12"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as r:
            commits = json.load(r)
    except OSError as e:
        print(f"{name}: skipped ({e})")
        continue
    lines = [f"{c['commit']['author']['date']}\t{c['sha'][:7]}\t{c['commit']['message'].splitlines()[0]}" for c in commits]
    with open(f"content/commits/{name}.txt", "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"{name}: {len(lines)} commits")
