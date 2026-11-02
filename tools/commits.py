#!/usr/bin/env python3
"""Fetches the latest commits of each project with a GitHub repo, for the
logs view (press l on a project). Writes content/commits/<project>.txt as
"date<TAB>sha<TAB>subject" lines. Needs the gh CLI."""
import configparser
import os
import subprocess

projects = configparser.ConfigParser(strict=False, interpolation=None)
projects.read_string(open("content/projects.ini").read())
os.makedirs("content/commits", exist_ok=True)

for name in projects.sections():
    repo = projects[name].get("repo", "")
    if not repo.startswith("https://github.com/"):
        continue
    slug = repo.removeprefix("https://github.com/")
    try:
        out = subprocess.run(
            ["gh", "api", f"repos/{slug}/commits?per_page=12", "--jq",
             '.[] | [.commit.author.date, .sha[:7], (.commit.message | split("\\n")[0])] | @tsv'],
            capture_output=True, text=True, timeout=30, check=True).stdout
    except (subprocess.SubprocessError, OSError) as e:
        print(f"{name}: skipped ({e.__class__.__name__})")
        continue
    open(f"content/commits/{name}.txt", "w").write(out)
    print(f"{name}: {len(out.splitlines())} commits")
